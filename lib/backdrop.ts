/** Shared backdrop photo — shells paint this once; pages sit in the shell. */
export const BACKDROP_SRC = "/backdrop.jpg" as const;

export const BACKDROP_CLASS = "bg-flagblue-50 bg-cover bg-center" as const;

export const backdropStyle = {
  backgroundImage: `url('${BACKDROP_SRC}')`,
} as const;
