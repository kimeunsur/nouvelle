import { ReactNode } from "react"

const inputLabelStyle = `
  block
  text-xl text-gray
`
const inputEditLabelStyle = `
  block
  text-xl text-gray
`

const inputLineStyle = `
  border-b border-gray
  bg-transparent
  text-2xl text-gray
  w-full h-16
  p-2
  focus:outline-none
`

const inputEditLineStyle = `
  border-b border-gray
  bg-transparent
  text-2xl text-gray
  w-full h-16
  p-2
  focus:outline-none
`


export const InputTextbox: React.FC<{
    label: string,
    labelType: string,
    storingData: string,
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    children: ReactNode}> = ({label, labelType, storingData, changeHandler, children}) => {
    return (
        <div>
            <label htmlFor={label} className={inputLabelStyle}>
                {children}
            </label>
            <input type={labelType}
                id={label}
                value={storingData}
                onChange={changeHandler}
                className={inputLineStyle} />
        </div>
    )
}

export const InputEditbox: React.FC<{
  label: string,
  labelType: string,
  storingData: string,
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
  children: ReactNode}> = ({label, labelType, storingData, changeHandler, children}) => {
  return (
      <div className="flex flex-row justify-between">
          <label htmlFor={label} className={inputEditLabelStyle}>
              {children}
          </label>
          <input type={labelType}
              id={label}
              value={storingData}
              onChange={changeHandler}
              className={inputEditLineStyle} />
      </div>
  )
}
