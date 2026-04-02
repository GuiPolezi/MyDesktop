import { Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { PublicRoute } from "./components/PublicRoute"
import { PrivateRoute } from "./components/PrivateRoute"
import { Home } from './pages/index'
import { CriarModulo } from "./components/Modulo"
import { CriarSubModulo } from "./components/SubModulo"
import { CriarCards } from "./components/Cards"
import { SubPage } from "./pages/submodulo"
import { MinhasEquipes, DashboardEquipe } from "./pages/equipes"
import { CriarModuloEquipe } from "./components/ModuloEquipe"
import { CriarEquipe, MembrosEquipe } from "./components/GerenciarEquipe"

export default function AppRoutes({ session }) {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <PrivateRoute session={session}>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute session={session}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute session={session}>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/criarmodulo"
        element={
          <PrivateRoute session={session}>
            <CriarModulo />
          </PrivateRoute>
        }
      />

      <Route
        path="/criarsubmodulo/:idModulo"
        element={
          <PrivateRoute session={session}>
            <CriarSubModulo />
          </PrivateRoute>
        }
      />

      <Route 
        path="/criarcard/:idModulo/:idSubModulo?" // o ? Torna o idSubModulo opcional
        element={
          <PrivateRoute session={session}>
            <CriarCards />
          </PrivateRoute>
        }
      />

      {/* Página individual de cada submodulo */}
      <Route
        path="/submodulo/:idSubmodulo"
        element={
          <PrivateRoute session={session}>
            <SubPage /> {/* Vamos criar esta página no passo 3 */}
          </PrivateRoute>
        }
      />

      <Route 
        path="/equipes"
        element={
          <PrivateRoute session={session}>
            <MinhasEquipes />
          </PrivateRoute>
        }
      />

      <Route 
        path="/equipe/:idEquipe"
        element={
          <PrivateRoute session={session}>
            <DashboardEquipe />
          </PrivateRoute>
        }
      />

      <Route 
        path="/equipe/:idEquipe/criar-modulo"
        element={
          <PrivateRoute session={session}>
            <CriarModuloEquipe />
          </PrivateRoute>
        }
      />

      <Route 
        path="/equipes/criar"
        element={
          <PrivateRoute session={session}>
            <CriarEquipe />
          </PrivateRoute>
        }
      />


      <Route 
        path="/equipe/:idEquipe/membros"
        element={
          <PrivateRoute session={session}>
            <MembrosEquipe />
          </PrivateRoute>
        }
      />

      {/* 🔹 ROTA 404: DEVE SER ESTRITAMENTE A ÚLTIMA ROTA */}
      <Route 
        path="*" 
        element={
          <NotFound />
        } 
      />

    </Routes>
  )
}