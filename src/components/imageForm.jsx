import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

// 🌟 Estilos básicos
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 375px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const InputFile = styled.input`
  padding: 0.5rem;
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: #5fb8d6;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #48a2bf;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const UploadImageForm = ({ endpoint, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cuando el usuario selecciona un archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));  // muestra un preview
    }
  };

  // Cuando el usuario da submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Por favor selecciona una imagen antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);  // 👈 nombre del campo en el backend

    try {
      setLoading(true);
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Upload successful:", response.data);
      if (onSuccess) onSuccess(response.data);
      alert("Imagen subida con éxito");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Hubo un error al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <label>
        Selecciona una imagen:
        <InputFile type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {previewUrl && <ImagePreview src={previewUrl} alt="Vista previa" />}

      <SubmitButton type="submit" disabled={loading}>
        {loading ? "Subiendo..." : "Subir Imagen"}
      </SubmitButton>
    </FormContainer>
  );
};

export default UploadImageForm;
