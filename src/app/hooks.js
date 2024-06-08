import { useDispatch, useSelector } from 'react-redux'

// Assuming you have defined these types in your store file
// import { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch()
export const useAppSelector = (selector) => useSelector(selector)
