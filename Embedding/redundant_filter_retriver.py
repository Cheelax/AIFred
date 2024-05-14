from typing import Any, Dict, List, Optional
from langchain.embeddings.base import Embeddings
from langchain.vectorstores import Chroma
from langchain.schema import BaseRetriever

class RedundantFilterRetriver(BaseRetriever):
    embeddings: Embeddings
    chroma: Chroma

    def get_relevant_documents(self, query):
       emb = self.embeddings.embed_query(query)
       return self.chroma.max_marginal_relevance_search_by_vector(
           embedding=emb,
           lambda_mult=0.9
           #improve lambda for code
       )
    
    async def aget_relevant_documents(self, query):
        return []