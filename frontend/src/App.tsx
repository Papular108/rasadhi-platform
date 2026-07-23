import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppLayout from "@/components/layout/AppLayout"
import HomePage from "@/pages/HomePage"
import NotFoundPage from "@/pages/NotFoundPage"
import ExplorerPage from "@/features/explorer/ExplorerPage"
import PreprocessingPage from "@/features/preprocessing/PreprocessingPage"
import ClusteringPage from "@/features/clustering/ClusteringPage"
import SplittingPage from "@/features/splitting/SplittingPage"
import SimilarityPage from "@/features/similarity/SimilarityPage"
import FilterComparisonPage from "@/features/filter-comparison/FilterComparisonPage"
import ConverterPage from "@/features/converter/ConverterPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/preprocessing" element={<PreprocessingPage />} />
            <Route path="/clustering" element={<ClusteringPage />} />
            <Route path="/splitting" element={<SplittingPage />} />
            <Route path="/similarity" element={<SimilarityPage />} />
            <Route path="/filter-comparison" element={<FilterComparisonPage />} />
            <Route path="/converter" element={<ConverterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
