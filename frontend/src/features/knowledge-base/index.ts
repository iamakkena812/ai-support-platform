/**
 * Knowledge Base feature exports.
 */

export * from "./api/knowledgeBase.api";

export * from "./components/KnowledgeArticleCard";
export * from "./components/KnowledgeArticleEditor";
export * from "./components/KnowledgeArticleList";
export * from "./components/KnowledgeCategoryList";
export * from "./components/KnowledgeFilters";
export * from "./components/KnowledgeSearch";

export * from "./hooks/useKnowledgeArticle";
export * from "./hooks/useKnowledgeArticles";

export * from "./pages/CreateKnowledgeArticlePage";
export * from "./pages/KnowledgeArticlePage";
export * from "./pages/KnowledgeBasePage";

export {
  createKnowledgeArticleSchema,
  knowledgeArticleStatusSchema,
  knowledgeFilterSchema,
  knowledgeQuerySchema,
} from "./schemas/knowledgeBase.schema";

export type {
  CreateKnowledgeArticleValues,
  KnowledgeFilterValues,
  KnowledgeQueryValues,
} from "./schemas/knowledgeBase.schema";

export * from "./services/knowledgeBase.service";

export type {
  CreateKnowledgeArticleRequest,
  KnowledgeArticle,
  KnowledgeArticleListQuery,
  KnowledgeArticleListResponse,
  KnowledgeArticleStatus,
  KnowledgeCategory,
  KnowledgeFilterState,
} from "./types/knowledgeBase.types";

export * from "./utils";