// src/core/llm/ModelManager.ts
import { logger } from '../Logger'; // Using the new logger

// Placeholder for actual model type. This would be more specific in a real implementation,
// potentially an interface or a base class for different LLM models.
export interface IManagedModel {
  modelId: string;
  // Optional: method to explicitly unload or dispose of model resources
  dispose?: () => Promise<void>; 
}

export class ModelManager<T extends IManagedModel> {
  private modelCache: Map<string, T>;
  private modelAccessOrder: string[]; // For LRU: stores model IDs in order of access, oldest first
  private maxCacheSize: number;

  constructor(maxSize: number = 3) { // Default max size of 3 models
    this.modelCache = new Map();
    this.modelAccessOrder = [];
    this.maxCacheSize = maxSize;
    if (maxSize <= 0) {
        logger.error('ModelManager: Max cache size must be a positive number.', { maxSize });
        throw new Error("Max cache size must be a positive number.");
    }
    logger.info(`ModelManager initialized with max cache size: ${maxSize}`);
  }

  /**
   * Loads a model, utilizing the cache if available.
   * Implements LRU cache eviction strategy.
   * @param modelId Identifier for the model to load.
   * @param loadFn Asynchronous function to actually load the model if not in cache. 
   *               This function should return an object conforming to IManagedModel.
   * @returns Promise<T> The loaded model.
   */
  async loadModel(modelId: string, loadFn: () => Promise<T>): Promise<T> {
    if (this.modelCache.has(modelId)) {
      this.updateAccessOrder(modelId);
      logger.debug(`ModelManager: Model ${modelId} loaded from cache.`);
      return this.modelCache.get(modelId)!;
    }

    logger.info(`ModelManager: Model ${modelId} not in cache. Loading...`);
    const model = await loadFn();
    if (model.modelId !== modelId) {
        logger.error(
            `ModelManager: Loaded model ID '${model.modelId}' does not match requested ID '${modelId}'.`,
            { requestedModelId: modelId, loadedModelId: model.modelId }
        );
        // Potentially throw an error or handle this mismatch appropriately
    }

    if (this.modelCache.size >= this.maxCacheSize && this.maxCacheSize > 0) {
      const lruModelId = this.modelAccessOrder.shift(); // Oldest is at the beginning
      if (lruModelId) {
        const evictedModel = this.modelCache.get(lruModelId);
        this.modelCache.delete(lruModelId);
        logger.info(`ModelManager: Cache full. Evicted model ${lruModelId}.`);
        if (evictedModel?.dispose) {
          try {
            await evictedModel.dispose();
            logger.debug(`ModelManager: Disposed evicted model ${lruModelId}.`);
          } catch (e) {
            logger.error(`ModelManager: Error disposing evicted model ${lruModelId}.`, { error: e });
          }
        }
      }
    }

    this.modelCache.set(modelId, model);
    this.modelAccessOrder.push(modelId); // Add new model as most recently used
    logger.info(`ModelManager: Model ${modelId} loaded and cached. Cache size: ${this.modelCache.size}`);
    return model;
  }

  /**
   * Updates the access order for LRU cache.
   * Moves the accessed modelId to the end of the array (most recently used).
   * @param modelId The ID of the model that was accessed.
   */
  private updateAccessOrder(modelId: string): void {
    const index = this.modelAccessOrder.indexOf(modelId);
    if (index > -1) {
      this.modelAccessOrder.splice(index, 1); // Remove from current position
    }
    this.modelAccessOrder.push(modelId); // Add to the end
  }

  /**
   * Clears the entire model cache and disposes models if they have a dispose method.
   */
  public async clearCache(): Promise<void> {
    logger.info('ModelManager: Clearing cache...');
    for (const model of this.modelCache.values()) {
      if (model.dispose) {
        try {
          await model.dispose();
          logger.debug(`ModelManager: Disposed model ${model.modelId} during cache clearing.`);
        } catch (e) {
          logger.error(`ModelManager: Error disposing model ${model.modelId} during cache clearing.`, { error: e });
        }
      }
    }
    this.modelCache.clear();
    this.modelAccessOrder = [];
    logger.info('ModelManager: Cache cleared.');
  }

  /**
   * Gets the current size of the cache.
   * @returns number The number of models currently in the cache.
   */
  public getCacheSize(): number {
    return this.modelCache.size;
  }

  /**
   * Checks if a model is currently in the cache.
   * @param modelId The ID of the model.
   * @returns boolean True if the model is cached, false otherwise.
   */
  public isCached(modelId: string): boolean {
    return this.modelCache.has(modelId);
  }
}
