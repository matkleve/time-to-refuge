/** Shared backdrop photo — shells and full-screen sheets all use this. */
export const BACKDROP_SRC = "/backdrop.jpg" as const;

export const BACKDROP_CLASS = "bg-flagblue-50 bg-cover bg-center" as const;

export const backdropStyle = {
  backgroundImage: `url('${BACKDROP_SRC}')`,
} as const;
