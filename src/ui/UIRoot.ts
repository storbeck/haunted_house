import type { AccessibilitySettings, PuzzleDefinition } from '../types';
import type { GameState, GameEvent } from '../state/gameState';

export class UIRoot {
  private root: HTMLElement;
  private inventoryBar: HTMLDivElement;
  private statusLine: HTMLSpanElement;
  private subtitle: HTMLDivElement;
  private toast: HTMLDivElement;
  private settingsPanel: HTMLDivElement;
  private puzzleContainer: HTMLDivElement | null = null;
  private activePuzzleResolve: ((choice: string | null) => void) | null = null;
  private accessibility: AccessibilitySettings;

  constructor(root: HTMLElement, private gameState: GameState) {
    this.root = root;
    this.root.innerHTML = '';

    this.inventoryBar = document.createElement('div');
    this.inventoryBar.className = 'inventory-bar';
    this.statusLine = document.createElement('span');
    this.statusLine.className = 'status-line';
    this.inventoryBar.appendChild(this.statusLine);

    this.subtitle = document.createElement('div');
    this.subtitle.className = 'subtitle';
    this.subtitle.style.opacity = '0';

    this.toast = document.createElement('div');
    this.toast.className = 'toast';

    this.settingsPanel = document.createElement('div');
    this.settingsPanel.className = 'settings-panel';
    this.settingsPanel.innerHTML = `
      <strong>Accessibility</strong>
      <label>Reduce Motion <input type="checkbox" data-setting="reduceMotion" /></label>
      <label>High Contrast <input type="checkbox" data-setting="highContrast" /></label>
      <label>Subtitles <input type="checkbox" data-setting="subtitles" checked /></label>
      <button type="button" data-action="reset">Reset Progress</button>
    `;

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.justifyContent = 'space-between';
    topRow.appendChild(this.toast);
    topRow.appendChild(this.settingsPanel);

    this.root.appendChild(topRow);
    this.root.appendChild(this.inventoryBar);
    this.root.appendChild(this.subtitle);

    this.accessibility = this.gameState.accessibility;
    this.syncAccessibilityUI();

    this.settingsPanel.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.dataset.setting) {
        this.gameState.setAccessibility({
          [target.dataset.setting]: target.checked
        } as Partial<AccessibilitySettings>);
      }
    });

    const resetButton = this.settingsPanel.querySelector(
      'button[data-action="reset"]'
    ) as HTMLButtonElement | null;
    resetButton?.addEventListener('click', () => {
      if (confirm('Reset progress and restart from the foyer?')) {
        this.gameState.reset();
      }
    });

    this.gameState.addListener((event) => this.onGameEvent(event));
    this.renderInventory(this.gameState.inventory, this.gameState.activeItem);
  }

  setStatusText(text: string) {
    this.statusLine.textContent = text;
  }

  showToast(message: string) {
    this.toast.textContent = message;
    this.toast.classList.add('visible');
    window.setTimeout(() => {
      this.toast.classList.remove('visible');
    }, 2000);
  }

  showSubtitle(text: string) {
    if (!this.accessibility.subtitles) {
      return;
    }
    this.subtitle.textContent = text;
    this.subtitle.style.opacity = '1';
    this.subtitle.classList.toggle('high-contrast', this.accessibility.highContrast);
    window.setTimeout(() => {
      this.subtitle.style.opacity = '0';
    }, 2500);
  }

  openPuzzle(puzzle: PuzzleDefinition): Promise<string | null> {
    this.closePuzzle();
    return new Promise((resolve) => {
      this.activePuzzleResolve = resolve;
      this.puzzleContainer = document.createElement('div');
      this.puzzleContainer.className = 'puzzle-modal';
      const card = document.createElement('div');
      card.className = 'puzzle-card';
      const title = document.createElement('h2');
      title.textContent = puzzle.name;
      const description = document.createElement('p');
      description.textContent = puzzle.description;
      const mechanic = document.createElement('p');
      mechanic.innerHTML = `<em>${puzzle.mechanic}</em>`;
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(mechanic);

      puzzle.options.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = option.hint
          ? `${option.label} — ${option.hint}`
          : option.label;
        button.addEventListener('click', () => {
          this.closePuzzle(option.id);
        });
        card.appendChild(button);
      });

      const cancel = document.createElement('button');
      cancel.textContent = 'Step back';
      cancel.addEventListener('click', () => {
        this.closePuzzle(null);
      });
      card.appendChild(cancel);

      this.puzzleContainer.appendChild(card);
      document.body.appendChild(this.puzzleContainer);
    });
  }

  closePuzzle(result: string | null = null) {
    if (this.puzzleContainer) {
      this.puzzleContainer.remove();
      this.puzzleContainer = null;
    }
    if (this.activePuzzleResolve) {
      this.activePuzzleResolve(result);
      this.activePuzzleResolve = null;
    }
  }

  private onGameEvent(event: GameEvent) {
    switch (event.type) {
      case 'inventoryChanged':
        this.renderInventory(event.inventory, this.gameState.activeItem);
        break;
      case 'itemSelected':
        this.renderInventory(this.gameState.inventory, event.item);
        break;
      case 'toast':
        this.showToast(event.message);
        break;
      case 'accessibilityChanged':
        this.accessibility = event.settings;
        this.syncAccessibilityUI();
        break;
      default:
        break;
    }
  }

  private renderInventory(items: string[], selected: string | null) {
    const fragments = document.createDocumentFragment();
    const label = document.createElement('strong');
    label.textContent = 'Inventory';
    fragments.appendChild(label);

    items.forEach((item) => {
      const element = document.createElement('button');
      element.className = 'inventory-item';
      if (selected === item) {
        element.classList.add('active');
      }
      element.textContent = item.replace(/_/g, ' ');
      element.addEventListener('click', () => {
        this.gameState.toggleItemSelection(item);
      });
      fragments.appendChild(element);
    });

    this.inventoryBar.innerHTML = '';
    this.inventoryBar.appendChild(this.statusLine);
    this.inventoryBar.appendChild(fragments);
  }

  private syncAccessibilityUI() {
    const reduceMotion = this.settingsPanel.querySelector<HTMLInputElement>(
      'input[data-setting="reduceMotion"]'
    );
    const highContrast = this.settingsPanel.querySelector<HTMLInputElement>(
      'input[data-setting="highContrast"]'
    );
    const subtitles = this.settingsPanel.querySelector<HTMLInputElement>(
      'input[data-setting="subtitles"]'
    );
    if (reduceMotion) reduceMotion.checked = this.accessibility.reduceMotion;
    if (highContrast) highContrast.checked = this.accessibility.highContrast;
    if (subtitles) subtitles.checked = this.accessibility.subtitles;
    this.subtitle.classList.toggle('high-contrast', this.accessibility.highContrast);
  }
}
