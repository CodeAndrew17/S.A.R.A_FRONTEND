import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { ImageUp, Image as ImageIcon } from "lucide-react"; //<ImageUp />
import Swal from "sweetalert2";
import { handleAxiosError } from "../../utils/alertUnauthorized";
import { getImage } from "../../api/api_Forms";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: auto;
  max-width: 475px;
  padding: 2rem;

  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(95, 184, 214, 0.5);
  border-radius: 18px;

  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  max-height: 265px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 500px) {
    max-width: 90%;
    padding: 1.5rem;
  }
`;

const InputFile = styled.input`
  padding: 0.6rem;
  border: 1px solid rgba(95, 184, 214, 0.6);
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: #5fb8d6;
    background: rgba(95, 184, 214, 0.08);
  }
`;

const SubmitButton = styled.button`
  padding: 0.9rem;
  background: linear-gradient(135deg, #5fb8d6, #4aa3c0);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  transition: background 0.2s, box-shadow 0.25s, transform 0.25s;

  &:hover {
    background: linear-gradient(135deg, #4aa3c0, #3b90a9);
    box-shadow: 0 6px 16px rgba(95, 184, 214, 0.4);
    transform: translateY(-3px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PreviewBox = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed rgba(95, 184, 214, 0.4);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  background: rgba(95, 184, 214, 0.05);
  transition: border-color 0.25s ease;

  &:hover {
    border-color: rgba(95, 184, 214, 0.7);
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
`;

const Placeholder = styled.div`
  color: #666;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
`;


const UploadImageForm = ({ endpoint, onSuccess, id_solicitud }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect( () =>  {
    const fetchExistImage = async () => {
      try {
        const data = await getImage(id_solicitud); 
        if (data?.imageUrl) { //verificamos que exista el atributo correcto para obtener la imagen 
          setPreviewUrl(data.imageUrl)
          console.log("que tengo en la repsuesta de la imagen get ",data)
        }
      } catch (error) {
        handleAxiosError(error);
        throw error; 
      }
    }; 

    fetchExistImage(); 

  }, [id_solicitud])

  console.log("que hay en el set de previwUrl", previewUrl)

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
