import { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Image,
  Modal,
  Popover,
  Text,
  VStack,
  View,
  useDisclose,
} from "native-base";
import Toast from "react-native-toast-message";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useColors } from "@app/context/ColorContex";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@app/context/AuthContext";
import { addAccount } from "@app/api/api";
import eventEmitter from "@app/api/eventEmitter";
import ConfirmModal from "./ConfirmModal";

const Header: React.FC = () => {
  const { bgColor, textColor, main, gray } = useColors();
  const { currentAddress, allAddresses, user, login, setCurrentAddress } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addingStatus, setAddingStatus] = useState(false);
  const toggleModal = () => setModalVisible(!modalVisible);
  const handleAddAdress = () => {
    if (addingStatus) return;
    setAddingStatus(true);
    addAccount(
      user?.password,
      user?.accountInfo.addresses.findIndex((item) => item == "")
    );
  };

  useEffect(() => {
    eventEmitter.on("S2C/add-account", (res) => {
      if (res.data) {
        login(res.data);
      } else {
        Toast.show({ type: "error", text1: res.data.value.display });
      }
      setModalVisible(false);
      setAddingStatus(false);
    });
  }, []);

  return (
    <>
      <HStack bgColor={bgColor} p={3} alignItems="center">
        <VStack justifyContent={"center"}>
          <Image
            source={require("@assets/icon.png")}
            w={12}
            h={12}
            alt="Image"
          />
        </VStack>
        <HStack flex={1} justifyContent={"center"} px={10}>
          <Text numberOfLines={1} ellipsizeMode="middle">
            {currentAddress}
          </Text>
          <Popover
            trigger={(triggerProps) => {
              return (
                <TouchableOpacity
                  {...triggerProps}
                  onPress={() => setIsOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    size={20}
                    color={textColor}
                  ></FontAwesomeIcon>
                </TouchableOpacity>
              );
            }}
            isOpen={isOpen}
            onClose={() => setIsOpen(!isOpen)}
          >
            <Popover.Content accessibilityLabel="" mx={10}>
              <Popover.CloseButton onPress={() => setIsOpen(false)} />
              <Popover.Body bgColor={bgColor}>
                <VStack justifyContent={"center"} py={6}>
                  {allAddresses.map((address, key) => {
                    if (address != "")
                      return (
                        <TouchableOpacity
                          key={key}
                          onPress={() => {
                            setCurrentAddress(address);
                            setIsOpen(false);
                          }}
                        >
                          <Text
                            fontSize={"md"}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            py={1}
                            bgColor={main.crystalBlue}
                          >
                            {address}
                          </Text>
                        </TouchableOpacity>
                      );
                  })}
                </VStack>
                <HStack justifyContent={"center"} space={3}>
                  <Button
                    onPress={() => setIsOpen(false)}
                    w={"1/2"}
                    rounded={"md"}
                    _pressed={{ opacity: 0.6 }}
                    bgColor={gray.gray50}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      toggleModal();
                      setIsOpen(false);
                    }}
                    w={"1/2"}
                    rounded={"md"}
                    _pressed={{ opacity: 0.6 }}
                    bgColor={main.celestialBlue}
                  >
                    Add Address
                  </Button>
                </HStack>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </HStack>
        <VStack justifyContent={"center"}>
          <LogoutButton />
        </VStack>
      </HStack>
      <ConfirmModal
        isOpen={modalVisible}
        onToggle={toggleModal}
        onPress={handleAddAdress}
      >
        <>
          <Text fontSize={"2xl"} textAlign={"center"}>
            Create New Address
          </Text>
          <Text textAlign={"center"}>
            An Account can't have more than 10 addresses
          </Text>
        </>
      </ConfirmModal>
    </>
  );
};

export default Header;
