//"https://piedra-papel-tijera-mod6.herokuapp.com"
const API_BASE_URL = "http://localhost:3000";

const state = {
  data: {
    user: {
      fullname: "",
      email: "",
      token: "",
      userGeoLoc: {
        lat: "",
        lng: "",
      },
      _geoloc: {
        lat: "",
        lng: "",
      },
      emailExist: "",
      passwordId: "",
      pageBefore: "",
      petData: "",
      petReports: "",
    },
  },
  listeners: [],
  init() {
    const lastStorage = JSON.parse(localStorage.getItem("userData"));

    if (lastStorage) {
      this.setState(lastStorage);
    } else {
      const cs = state.getState();
      this.setState(cs);
    }
  },
  getState() {
    return this.data;
  },
  setUserEmail(email: string) {
    const cs = state.getState();
    cs.user.email = email;
    this.setState(cs);
  },
  setUserFullname(fullname: string) {
    const cs = this.getState();
    cs.user.fullname = fullname;
    this.setState(cs);
  },
  setUserToken(token) {
    const cs = this.getState();
    cs.user.token = token;
    this.setState(cs);
  },
  setUserGeoLoc(lat, lng) {
    const cs = this.getState();
    cs.user.userGeoLoc.lat = lat;
    cs.user.userGeoLoc.lng = lng;
    this.setState(cs);
  },
  setPageBefore(page: string) {
    const cs = this.getState();
    cs.user.pageBefore = page;
    this.setState(cs);
  },
  setPasswordId(passwordId) {
    const cs = this.getState();
    cs.user.passwordId = passwordId;
    this.setState(cs);
  },
  setPetData(petData) {
    const cs = this.getState();
    cs.user.petData = petData;
    this.setState(cs);
  },
  setGeolocPet(lat, lng) {
    const cs = this.getState();
    cs.user._geoloc.lat = lat;
    cs.user._geoloc.lng = lng;
    this.setState(cs);
  },
  // Cerrar sesión
  closeSessionUser() {
    localStorage.removeItem("userData");
    state.setState({
      user: {
        fullname: "",
        email: "",
        token: "",
        _geoloc: {
          lat: "",
          lng: "",
        },
        emailExist: "",
        pageBefore: "",
        petData: "",
        petReports: "",
        userGeoLoc: {
          lat: "",
          lng: "",
        },
      },
    });
  },
  // Chequear si el email existe
  async checkEmail(emailData) {
    const cs = this.getState();

    const resEmail = await fetch(API_BASE_URL + "/auth/emailCheck", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    });
    const data = await resEmail.json();
    cs.user.emailExist = data;
    return data;
  },
  // Crear el usuario
  async signUp(userData: { fullname; email; password }) {
    const resAuth = await fetch(API_BASE_URL + `/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await resAuth.json();

    return data;
  },
  // Iniciar sesión
  async signIn(authData: { email: string; password }) {
    const cs = state.getState();

    const resSignIn = await fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    const data = await resSignIn.json();

    if (data.token) {
      cs.user.token = data.token;
      this.setState(cs);
    }

    return data;
  },
  // Obtener la data del usario con el token
  async getUserData(token) {
    const cs = this.getState();

    const resUserData = await fetch(API_BASE_URL + "/me", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    const data = await resUserData.json();
    cs.user.fullname = data.fullname;
    this.setState(cs);
    return data;
  },
  // Cuando el usuario olvida la contraseña, para cambiarla
  async newPassword(authData: { email: string; password }){
    const resNewPassword = await fetch(API_BASE_URL + "/auth/forgot", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    const data = await resNewPassword.json();

    return data;
  },
  // modificar un usuario
  async modifiedUser(userData) {
    const cs = this.getState();
    const { token } = cs.user;

    const resModifiedUser = await fetch(API_BASE_URL + "/auth", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await resModifiedUser.json();
    return data;
  },
  // Crear un reporte
  async createReport(reportData){
    const resReport = await fetch(API_BASE_URL + `/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    const data = await resReport.json();

    return data;
  },
  // Reportar una mascota
  async newPet(petData) {
    const cs = this.getState();
    const { token } = cs.user;

    const resNewPet = await fetch(API_BASE_URL + `/pet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    const data = await resNewPet.json();

    return data;
  },
  // Mis mascotas Reportadas
  async userPets() {
    const cs = this.getState();
    const { token } = cs.user;

    const resUserPets = await fetch(API_BASE_URL + `/pet/allUserPets`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    const data = await resUserPets.json();

    if (data.amount) {
      cs.user.petReports = data.amount;
      this.setState(cs);
    }

    return data;
  },
  // modificar mascota
  async modifiedPet(petData, petId: number) {
    const cs = this.getState();
    const { token } = cs.user;

    const resModifiedPet = await fetch(API_BASE_URL + `/pet/${petId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    const data = await resModifiedPet.json();
    return data;
  },
  // Eliminar mascota
  async eliminatePet(petId: number) {
    const cs = this.getState();
    const { token } = cs.user;

    const resDeletePet = await fetch(API_BASE_URL + `/pet/${petId}`, {
      method: "DELETE",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    const data = await resDeletePet.json();

    if (data.message) {
      cs.user.petData = "";
      this.setState(cs);
    }

    return data;
  },
  // Buscar mascotas cerca de la ubicación del usuario
  async lostPetsNearby() {
    const cs = this.getState();
    const { lat, lng } = cs.user.userGeoLoc;

    const resUserPets = await fetch(
      API_BASE_URL + `/lostPetNear?lat=${lat}&lng=${lng}`
    );

    return await resUserPets.json();
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("userData", JSON.stringify(newState));

    console.log("Nuevo Estado:", newState);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
