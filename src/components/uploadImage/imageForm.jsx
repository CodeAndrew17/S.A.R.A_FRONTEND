import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ImageUp, Image as ImageIcon } from "lucide-react"; //<ImageUp />
import Swal from "sweetalert2";
import { handleAxiosError } from "../../utils/alertUnauthorized";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: auto;
  max-width: 475px;
  padding: 1.5rem;

  background: rgba(250, 250, 250, 0.75); /* Blanco translúcido */
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(102, 204, 204, 0.7); /* Verde menta suave que resalta */
  border-radius: 12px;

  transition: box-shadow 0.2s ease, transform 0.2s ease;
  max-height: 265px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.20);
  }

  @media (max-width: 500px) {
    max-width: 90%;
  }
`;



const InputFile = styled.input`
  padding: 0.5rem;
  border: 1px solid #90a4ae;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #78909c;
  }

  @media (max-width: 500px) {
    max-width: 270px;
  }
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: #5fb8d6;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    background-color: #48a2bf;
    box-shadow: 0 4px 12px rgba(72, 162, 191, 0.3);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PreviewBox = styled.div`
  width: 100%;
  height: 200px;
  border: 1px dashed #90a4ae;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(95, 184, 214, 0.05);
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Placeholder = styled.div`
  color: #999;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

const UploadImageForm = ({ endpoint, onSuccess, id_solicitud }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return Swal .fire("Ningun archivo seleccionado", "Por favor selecciona un archivo para subir ", "warning");

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("id_solicitud", id_solicitud)

    try {
      setLoading(true);
      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess?.(data);
      Swal .fire("Imagen subida con exito", "La imagen  se envio correctamente", "success");
    } catch (err) {
      console.error(err);
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <label>
        Sube la imagen del vehiculo, formato de archivo requerido: JPG o PNG.
        <InputFile type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <PreviewBox>
        {previewUrl ? (
          <ImagePreview src={previewUrl} alt="Vista previa" />
        ) : (
          <Placeholder>
            <ImageIcon size={48} />
            {loading ? "Subiendo..." : "Sin imagen"}
          </Placeholder>
        )}
      </PreviewBox>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? (
          "Subiendo..."
        ) : (
          <>
            <ImageUp size={18} /> Subir Imagen
          </>
        )}
      </SubmitButton>
    </FormContainer>
  );
};

export default UploadImageForm;
