import React, { useState, useCallback, useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { InputEditbox } from "../components/InputTextbox";
import { requestSys } from "../systems/Requests";
import MainPage from "./MainPage";
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export interface configType {
  color: string;
  stack: string[];
  external_link1: string;
  external_link2: string;
  email: string;
}

export const EditPage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>(" ");
  const [itemFormData, setItemFormData] = useState<configType>({
    color: "#ffffff",
    stack: [],
    external_link1: "",
    external_link2: "",
    email: "",
  });

  const photos = [
    { src: "tex_kotlin.png", label: "kotlin" },
    { src: "tex_mongo.png", label: "mongo" },
    { src: "tex_python.png", label: "python" },
    { src: "tex_react.png", label: "react" },
    { src: "tex_three.png", label: "three" },
    { src: "tex_type.png", label: "type" },
  ];
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const handlePhotoClick = (label: string) => {
    const modified = selectedPhotos.includes(label)
                    ? selectedPhotos.filter((item) => item !== label)
                    : [...selectedPhotos, label]
    setSelectedPhotos(modified);
    setItemFormData((prev) => ({
      ...prev,
      stack: modified,
    }));

    return modified
  };

  const handleColorChange = useCallback((color: string) => {
    setItemFormData((prevState) => ({
      ...prevState,
      color,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await requestSys.storeItem(itemFormData);
    } catch (error) {
      console.error("Item register failed", error);
    }
  };

  const navigate = useNavigate();
  const gotoMainPage = () => {
    navigate(`/main?turnback=1&email=${itemFormData.email}`);
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (email) {
      requestSys
        .getUser(email)
        .then(() => setItemFormData((prev) => ({
            ...prev,
            email,
        })))
        .then(() => requestSys
            .bringItem(email)
            .then((res) => res.json())
            .then((res) => res.ITEM)
            .then((res) => {console.log("res", res); return res})
            .then((res) => setItemFormData({
                color: res.color,
                stack: res.stack,
                external_link1: res.external_link1,
                external_link2: res.external_link2,
                email: res.email
        })))
        .then(() => console.log("item form data", itemFormData))
        .then(() => setSelectedPhotos(itemFormData.stack))
        .then(() => console.log(selectedPhotos));
    }
  }, []);

  return (
    <form className="w-[100vw] h-[100vh] bg-navyDark flex flex-row text-white text-xl justify-center items-center" onSubmit={handleSubmit}>
      <div>
        <div className="mb-20">
          <InputEditbox
            label="selColor"
            labelType="text"
            storingData={itemFormData.color}
            changeHandler={(e) => handleColorChange(e.target.value)}
          >
            색상
          </InputEditbox>


          {(
            <ChromePicker
                color={itemFormData.color} className="mt-4"
                onChange={(color: ColorResult) => handleColorChange(color.hex)}
            />            
          )}

        </div>

        <div className="mb-20">
          <label htmlFor="selStack" className="mr-12">
            스택
          </label>
          <div
            className="grid grid-cols-3 gap-4 p-7"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
              gap: "10px",
            }}
          >
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer ${
                  selectedPhotos.includes(photo.label)
                    ? "opacity-100"
                    : "opacity-50"
                } transition-opacity duration-300`}
                onClick={() => handlePhotoClick(photo.label)}
              >
                <img
                  src={photo.src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-auto rounded shadow-lg group-hover:opacity-75"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center p-1">
                  {photo.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <InputEditbox
          label="selUrl"
          labelType="text"
          storingData={itemFormData.external_link1}
          changeHandler={(e) =>
            setItemFormData({
              ...itemFormData,
              external_link1: e.target.value,
            })
          }
        >
          외부링크
        </InputEditbox>
        <div className="mt-8">
            <InputEditbox
            label="selUrl"
            labelType="text"
            storingData={itemFormData.external_link2}
            changeHandler={(e) =>
                setItemFormData({
                ...itemFormData,
                external_link2: e.target.value,
                })
            }
            >
            외부링크
            </InputEditbox>
        </div>
      </div>
      <div>
        <button type="submit" className="ml-12 text-2xl hover:text-yellow" onClick={gotoMainPage}>
          생성
        </button>
      </div>
    </form>
  );
};
