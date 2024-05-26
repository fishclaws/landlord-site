import create from "zustand";

export const useStore = create((set) => ({
 // get the data from local storage
 authData: localStorage.getItem("authData")
   ? JSON.parse(localStorage.getItem("authData") as any)
   : null,

 setAuthData: (authData: any) => {
   localStorage.setItem("authData", JSON.stringify(authData));
   set({ authData });
 },
}));