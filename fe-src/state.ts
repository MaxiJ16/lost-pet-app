const API_BASE_URL = "https://lost-pet-v1.onrender.com";

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
  // INICIALIZAMOS EL STATE
  init() {
    const lastStorage = JSON.parse(localStorage.getItem("userData") as any);

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
  // CREATE USER
  async signUp(userData: { fullname; email; password }) {
    const resAuth = await fetch(API_BASE_URL + `/auth`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await resAuth.json();

    return data;
  },
  // INICIAR SESIÓN
  async signIn(authData: { email: string; password }) {
    const cs = state.getState();

    const resSignIn = await fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
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
  // CERRAR SESIÓN
  closeSessionUser() {
    // REMOVEMOS EL ITEM DEL LOCALSTORAGE
    localStorage.removeItem("userData");
    // EL ESTADO VUELVE A TENER SUS VALORES INICIALES
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
  // CHEQUEA EL EMAIL
  async checkEmail(emailData) {
    const cs = this.getState();

    const resEmail = await fetch(API_BASE_URL + "/auth/emailCheck", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await resEmail.json();
    cs.user.emailExist = data;
    return data;
  },
  // OBTIENE LA DATA DEL USER CON EL TOKEN
  async getUserData(token) {
    const cs = this.getState();

    const resUserData = await fetch(API_BASE_URL + "/me", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `bearer ${token}`,
      },
    });
    const data = await resUserData.json();
    cs.user.fullname = data.fullname;
    this.setState(cs);
    return data;
  },
  // MODIFICAR USUARIO
  async modifiedUser(userData) {
    const cs = this.getState();
    const { token } = cs.user;

    const resModifiedUser = await fetch(API_BASE_URL + "/auth", {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await resModifiedUser.json();
    return data;
  },
  // CUANDO EL USER OLVIDA LA CONTRASEÑA
  async newPassword(authData: { email: string; password }) {
    const resNewPassword = await fetch(API_BASE_URL + "/auth/forgot", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    const data = await resNewPassword.json();
    return data;
  },
  // CREA UN REPORTE
  async createReport(reportData) {
    const resReport = await fetch(API_BASE_URL + `/report`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    const data = await resReport.json();

    return data;
  },
  // CREAR UNA MASCOTA PERDIDA
  async newPet(petData) {
    const cs = this.getState();
    const { token } = cs.user;

    const resNewPet = await fetch(API_BASE_URL + `/pet`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    const data = await resNewPet.json();
    return data;
  },
  // OBTIENE LAS MASCOTAS PERDIDAS DEL USUARIO
  async userPets() {
    const cs = this.getState();
    const { token } = cs.user;

    const resUserPets = await fetch(API_BASE_URL + `/pet/allUserPets`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
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
  // MODIFICAR UNA MASCOTA
  async modifiedPet(petData, petId: number) {
    const cs = this.getState();
    const { token } = cs.user;

    const resModifiedPet = await fetch(API_BASE_URL + `/pet/${petId}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    const data = await resModifiedPet.json();
    return data;
  },
  // ELIMINAR MASCOTA
  async eliminatePet(petId: number) {
    const cs = this.getState();
    const { token } = cs.user;

    const resDeletePet = await fetch(API_BASE_URL + `/pet/${petId}`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
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
  // BUSCAR MASCOTAS CERCA DE UNA UBICACIÓN
  async lostPetsNearby(lat, lng) {
    // const cs = this.getState();
    // const { lat, lng } = cs.user.userGeoLoc;

    const resUserPets = await fetch(
      API_BASE_URL + `/lostPetNear?lat=${lat}&lng=${lng}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
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
