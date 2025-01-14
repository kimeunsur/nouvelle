import React, { useState, useCallback, useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { InputEditbox } from "../components/InputTextbox";
import { requestSys } from "../systems/Requests";

export type itemType = {
  color: string;
  stack: any[];
  external_link: string;
};

const EditPage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>(" ");
  const [itemFormData, setItemFormData] = useState<itemType>({
    color: "#ff0000",
    stack: [],
    external_link: "",
  });

  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  const togglePicker = () => {
    setPickerVisible((prev) => !prev);
  }
  const handleColorChange = useCallback((color: string) => {
    setItemFormData((prevState) => ({
      ...prevState,
      color,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...itemFormData,
        email: userEmail,
      };
      const result = await requestSys.getItem(userEmail, payload);
      console.log("item result:", result);
    } catch (error) {
      console.error("Item register failed", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    if (email) {
      requestSys
        .getUser(email)
        .then(() => setUserEmail(email))
        .catch((error) => console.error("Failed to fetch user data:", error));
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

          <button type="button" onClick={togglePicker}
            className="text-xl bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
          >
            {isPickerVisible ? "▲" : "▼"}
          </button>

          {isPickerVisible && (
            <ChromePicker
                color={itemFormData.color}
                onChange={(color: ColorResult) => handleColorChange(color.hex)}
            />            
          )}

        </div>

        <div className="mb-20">
          <label htmlFor="selStack" className="mr-12">
            스택
          </label>
          <input
            type="text"
            id="selStack"
            className="text-black bg-transparent border-b border-gray text-2xl text-gray focus:outline-none"
            value={itemFormData.stack.join(", ")}
            onChange={(e) =>
              setItemFormData({
                ...itemFormData,
                stack: e.target.value.split(",").map((item) => item.trim()),
              })
            }
          />
        </div>

        <InputEditbox
          label="selUrl"
          labelType="text"
          storingData={itemFormData.external_link}
          changeHandler={(e) =>
            setItemFormData({
              ...itemFormData,
              external_link: e.target.value,
            })
          }
        >
          외부링크
        </InputEditbox>
      </div>
      <div>
        <button type="submit" className="ml-12 text-2xl hover:text-yellow">
          Sign in
        </button>
      </div>
    </form>
  );
};

export default EditPage;