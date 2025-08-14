export const generarSlug = (nombre) => {
    return nombre
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");
};
