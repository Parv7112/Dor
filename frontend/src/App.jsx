import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';
import CategoryDetail from './pages/CategoryDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/AddProduct/EditProduct';
import { ROUTES } from './constants/routes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PRODUCTS} element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path={ROUTES.ARTISANS} element={<Artisans />} />
            <Route path="/artisans/:id" element={<ArtisanDetail />} />
            <Route path="/category/:category" element={<CategoryDetail />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADD_PRODUCT}
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/edit-product/:id"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
