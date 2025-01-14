import { useEffect, useState } from "react"
import { requestSys } from "../systems/Requests"
import { InputEditbox } from "../components/InputTextbox"

const backgroundStyle=`
    w-[100vw] h-[100vh]
    bg-navyDark
    flex flex-row
    text-white text-xl
    justify-center items-center
`

export type itemType = {
    color: string,
    stack: any[],
    external_link: string
}


const EditPage: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string>(" ");
    const [itemFormData, setItemFormData] = useState<itemType>({
        color: '',
        stack: [],
        external_link : '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setItemFormData({
            ...itemFormData,
            [id.slice(6).toLocaleLowerCase()]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', itemFormData);
        try {
            const payload = {
                color: itemFormData.color,
                stack: itemFormData.stack,
                external_link: itemFormData.external_link,
                email: userEmail,
            };
            console.log("PAYLOAD:", payload);
          const result = await requestSys.getItem(userEmail, payload);
          console.log('item result:', result);
        } catch (error) {            
          console.error('item register failed',error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (email) {
            requestSys.getUser(email).then(() => setUserEmail(email))
        }
    })

    return (
        <form className={backgroundStyle} onSubmit={handleSubmit}>
            <div>
                <div className="flex flex-row">
            <InputEditbox label="selColor" labelType="text" storingData={itemFormData.color} changeHandler={(e) => setItemFormData({...itemFormData, color: e.target.value})}>
                색상
            </InputEditbox>
                </div>
            <div>
                <label htmlFor="selStack">스택</label>
                <input
                    type="text"
                    id="selStack"
                    className="text-black"
                    value={itemFormData.stack.join(', ')} // 리스트를 문자열로 변환
                    onChange={(e) => setItemFormData({
                        ...itemFormData,
                        stack: e.target.value.split(',').map((item) => item.trim()), // 쉼표로 구분된 문자열을 리스트로 변환
                    })}
                />
            </div>
            <InputEditbox label="selUrl" labelType="text" storingData={itemFormData.external_link} changeHandler={(e) => setItemFormData({...itemFormData, external_link: e.target.value})}>
                외부링크
            </InputEditbox>
            </div>
            <div>
            <button type="submit">
                Sign in
            </button>
            </div>
        </form>
    )
}

export default EditPage