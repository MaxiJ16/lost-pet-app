// State & Router
import { state } from "./state";
import "./router";

// Components
import "./components/header";
import "./components/paw-pet";
import "./components/text";
import "./components/msg-comp"
import "./components/pet-card";
import "./components/pre-loader";

// Pages
import "./pages/home";
import "./pages/auth";
import "./pages/auth2";
import "./pages/my-data";
import "./pages/report-pets";
import "./pages/edit-pet";
import "./pages/my-pets-reports";


// Iniciamos el state.
(function () {
  state.init();
})();
