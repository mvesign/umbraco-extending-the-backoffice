import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_PROPERTY_DATASET_CONTEXT, type UmbPropertyDatasetContext } from '@umbraco-cms/backoffice/property';

interface ComplexData {
  markup: string;
  blocks: {
    contentData: any[];
    layout: object;
    propertyEditorAlias: string;
    settingsData: any[];
  };
}

@customElement('custom-workspace-view')
export class MyWorkspaceView extends UmbElementMixin(LitElement) {
  #datasetContext?: UmbPropertyDatasetContext;
  #bodyTextValue?: string;
  #complexDataValue?: ComplexData;  
  #plainText: string = '';

  sentences: string[] = [];
  styledSentences: { sentence: string, color: string }[] = [];
  avgSentenceLength = 0;
  avgSentenceColor = 'blue';
  topKeywords: string[] = [];

  constructor() {
    super();
    this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
      this.#datasetContext = instance;
      // Fetch the values once the context is set
      await this.setValues();
    });
  }

  async setValues() {
    if (this.#datasetContext) {
      const bodyTextValue = await this.#datasetContext.propertyValueByAlias<string>('bodyText');
      this.observe(bodyTextValue, (value) => {
        this.#bodyTextValue = value;
        this.calculateMetrics();
      });

      const complexDataValue = await this.#datasetContext.propertyValueByAlias<ComplexData>('complexData');
      this.observe(complexDataValue, (value) => {
        this.#complexDataValue = value;
        this.processComplexData();
      });
    }
    else {
      this.#bodyTextValue = "";
      this.processComplexData();
    }
  }

  render() {
    return html`
      <uui-box class="uui-text">
        <h1 class="uui-h2" style="margin-top: 16px;">Complex Data Content</h1>
        <div style="margin-top: 32px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px;">
            <span class="uui-lead">Word Count:</span>
            <uui-tag color="positive" style="margin-left: 8px;">${this.countWords(this.#plainText || '')}</uui-tag>
          </div>
        </div> 
        <h1 class="uui-h2" style="margin-top: 16px;">Body Text Content</h1>
        <div style="margin-top: 32px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px;">
            <span class="uui-lead">Word Count:</span>
            <uui-tag color="positive" style="margin-left: 8px;">${this.countWords(this.#bodyTextValue || '')}</uui-tag>
          </div>
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 32px;">
            <span class="uui-lead">Top Keywords:</span>
            <ul style="margin-top: 16px; padding-left: 40px;">
              ${this.topKeywords.length > 0
                ? this.topKeywords.map(keyword => html`<li>${keyword}</li>`)
                : html`<li>No keywords available.</li>`
              }
            </ul>
          </div>
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px;">
            <span class="uui-lead">Average Sentence Length:</span>
            <uui-tag style="background-color: ${this.avgSentenceColor}; color: white; margin-left: 8px;">
              ${this.avgSentenceLength.toFixed(0)}
            </uui-tag>
          </div>
          ${this.sentences.length === 0
            ? html`<p class="uui-lead">No body text available.</p>`
            : this.styledSentences.map(({ sentence, color }) => html`
              <p style="color: ${color};">
                ${sentence}
              </p>
            `)
          }
        </div>
      </uui-box>`;
  }

  processComplexData() {
    if (this.#complexDataValue
      && typeof this.#complexDataValue === 'object'
      && this.#complexDataValue.markup) {
      const markupContent = this.#complexDataValue.markup;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = markupContent;
      this.#plainText = tempDiv.textContent || '';
      this.requestUpdate();
    }
  }

  calculateMetrics() {
    this.sentences = this.getSentences(this.#bodyTextValue || '');
    this.styledSentences = this.getSentenceStyles(this.sentences);
    this.avgSentenceLength = this.averageSentenceLength(this.#bodyTextValue || '');
    this.avgSentenceColor = this.getAvgSentenceColor(this.avgSentenceLength);
    this.topKeywords = this.getTopKeywords(this.#bodyTextValue || '', 5);
    this.requestUpdate();
  }

  countWords(text: string): number {
    return text.trim().length > 0
      ? text.trim().split(/\s+/).length
      : 0;
  }
  
  averageSentenceLength(text: string): number {
    const sentences = text.split(/[.!?]/).filter(Boolean);
    const totalWords = this.countWords(text);
    return sentences.length
      ? totalWords / sentences.length
      : 0;
  }
  
  keywordFrequency(text: string): Map<string, number> {
    const cleanedText = text
      .toLowerCase()
      .replace(/[.,!?;:()'"-]/g, '')
      .split(/\s+/);
    const frequencyMap = new Map<string, number>();
    cleanedText.forEach(word => {
      // Only consider words longer than 3 characters.
      if (word.length > 3) {
        const count = frequencyMap.get(word) || 0;
        frequencyMap.set(word, count + 1);
      }
    });
    return frequencyMap;
  }
  
  getTopKeywords(text: string, limit: number): string[] {
    const keywordMap = this.keywordFrequency(text);
    const sortedKeywords = Array
      .from(keywordMap.entries())
      // Sort by frequency, descending.
      .sort(([, countA], [, countB]) => countB - countA)
      // Get top `limit` keywords.
      .slice(0, limit)
      .map(([word, count]) => `${word}: ${count}`);
    return sortedKeywords;
  }
  
  private getSentences(text: string): string[] {
    // Split by punctuation and filter out empty strings.
    return text.split(/(?<=[.!?])\s+/).filter(Boolean);
  }
  
  private getSentenceStyles(sentences: string[]): { sentence: string, color: string }[] {
    return sentences.map(sentence => ({
      sentence,
      color: this.countWords(sentence) > 25 ? 'red' : 'green'
    }));
  }
  
  private getAvgSentenceColor(avgSentenceLength: number): string {
    if (avgSentenceLength < 20) {
      return 'green';
    }
    if (avgSentenceLength >= 20 && avgSentenceLength <= 25) {
      return 'yellow';
    }
    if (avgSentenceLength > 30) {
      return 'red';
    }
    return 'blue';
  }

  static styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }
      p {
        font-size: 16px;
        margin: 0;
      }`,
  ];
}

export {
  MyWorkspaceView as default
};