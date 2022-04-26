// State & Router
import { state } from "./state";
import "./router";

// Pages
import "./pages/home";
import "./pages/auth";
import "./pages/auth2";
import "./pages/my-data";
import "./pages/report-pets";
import "./pages/edit-pet";
import "./pages/my-pets-reports";

// Components
import "./components/header";
import "./components/paw-pet";
import "./components/text";
import "./components/pet-card";

// Iniciamos el state.
(function () {
  state.init();
})();


