export const validateCreateUserForm = (formData, fields) => {
    let errors = {};

    fields.forEach((field) => {
        const rawValue = formData[field.name];
        const value = typeof rawValue === 'string' ? rawValue.trim() : String(rawValue || "").trim();

        if (field.required && !value) {
            errors[field.name] = `${field.placeholder} es obligatorio`;
        }

        if (value) { // Solo validar si hay valor
            if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
                errors.correo = "Correo inválido";
            }

            if (field.name === "cedula" && !/^\d+$/.test(value)) {
                errors.cedula = "La cédula solo puede contener números";
            }

            if (["nombres", "apellidos"].includes(field.name) && value.length < 3) {
                errors[field.name] = `${field.placeholder} debe tener al menos 3 caracteres`;
            }
        }
    });

    return errors;
};