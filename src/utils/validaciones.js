export const validateCreateUserForm = (formData, fields) => {
    let errors = {};


fields.forEach((field) => {
    const value = formData[field.name]?.trim();

    if (!value) {
        errors[field.name] = `${field.placeholder} es obligatorio`;
    }

    if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
        errors.correo = "Correo invalido";
    }

    if (field.name === "cedula" && value && !/^\d+$/.test(value)) {
        errors.cedula = "La cedúla solo puede contener números";
    }

    if (["nombres", "apellidos"].includes(field.name) && value.length < 3) {
        errors[field.name] = `${field.placeholder} debe tener al menos 3 caracteres`;
    }
});

return errors;

};