import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const Check = () => {
  const [showPopup, setShowPopup] = useState(
    localStorage.getItem("popup") !== "true"
  );
  const [response, setResponse] = useState("");

  const handleButtonClick = async () => {
    try {
      const response = await fetch(
        "https://netflyer-backend.nesbeer.repl.co/api/handleButtonClick",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setResponse(data.success ? "Thank You." : "Thank You Again.");
      setTimeout(() => {
        setShowPopup(false);
        localStorage.setItem("popup", "true");
      }, 3000);
    } catch (error) {
      console.error("Error handling button click:", error);
      setResponse("Error handling button click");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("popupShown")) {
      localStorage.removeItem("popupShown");
    }
    setShowPopup(localStorage.getItem("popup") !== "true");
  }, []);

  return (
    <>
      {showPopup && (
        <Modal
          onClose={() => setShowPopup(false)}
          className="text-white"
          placement="auto"
          isOpen={showPopup}
        >
          <ModalHeader>What's This?</ModalHeader>
          <ModalContent>
            <ModalBody>
              {response ? (
                <p>{response}</p>
              ) : (
                <p>This is popup to know if anyone is using this website.</p>
              )}
            </ModalBody>
            <ModalFooter>
              {response ? (
                <Button auto flat color="success" disabled>
                  <Spinner color="primary" />
                </Button>
              ) : (
                <Button onClick={handleButtonClick} auto flat color="danger">
                  I'm Using
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Check;
