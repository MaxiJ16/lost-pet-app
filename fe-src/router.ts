import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".container"));

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/auth", component: "auth-page" },
  { path: "/auth-2", component: "auth2-page" },
  { path: "/my-data", component: "my-data-page" },
  { path: "/report-pet", component: "report-pet-page" },
  { path: "/edit-pet", component: "edit-pet-page" },
  { path: "/my-pets", component: "my-pets-reports" },
]);
