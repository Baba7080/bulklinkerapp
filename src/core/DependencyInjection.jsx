import React from "react";
import { useToast } from '@chakra-ui/react'
import { deleteData, fetchData, postData, putData } from "./Services/API";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../app/store";
import { setData } from "../app/reducerSlice";
import { getBearerToken, getStorage, removeItem, setStorage } from "./Services/GLobalState";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { environment } from "../environments";
import { useRecoilState } from "recoil";
import { userDetailsState } from "../app/atoms";

const DI = (WrappedComponent) => {
  const FetchComponent = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.app);
    const navigate = useNavigate();
    const toast = useToast()
    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);

    const reduxMethods = {
      set: (stateKey, data) => dispatch(setData({ stateKey, data })),
      get: (stateKey) => selector[stateKey],
      state: selector,
    };

    const params = useParams();

    const userMethods = {
      get: (statekey) => (statekey ? userDetails[statekey] : userDetails),
      set: (data) => setUserDetails(data),
    };

    const globalState = {
      get: getStorage,
      set: setStorage,
      remove: removeItem,
      getBearerToken: getBearerToken,
    };

    const di = {
      GET: fetchData(reduxMethods),
      POST: postData(reduxMethods),
      PUT: putData(reduxMethods),
      DELETE: deleteData(reduxMethods),
      PARAMS: params,
      PUSH: (path, data) => {
        navigate(path, data);
      },
    };

    const modifiedProps = {
      ...props,
      redux: reduxMethods,
      user: userMethods,
      globalState: globalState,
      // environment: environment,
      location: useLocation(),
      success: (message) => {
        toast({
          title: message,
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      error: (message) => {
        toast({
          title: message,
          description: "",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      info: (message) => {
        toast({
          title: message,
          description: "",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      },
    };

    return <WrappedComponent {...modifiedProps} di={di} />;
  };

  return FetchComponent;
};

export default DI;
