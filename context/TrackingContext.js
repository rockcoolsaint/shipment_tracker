import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers, Signer } from "ethers";
import * as dotenv from "dotenv";

dotenv.config()

// INTERNAL IMPORT
import tracking from "../context/Tracking.json";
const ContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ContractABI = tracking.abi;


// ---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  // STATE VARIABLE
  const DappName = "Product Tracker Dapp";
  const [currentUser, setCurrentUser] = useState("");

  const createShipment = async (items) => {
    const { receiver, pickupTime, distance, price } = items;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const createItem = await contract.createShipment(
        receiver, new Date(pickupTime).getTime(), distance, ethers.utils.parseUnits(price, 18), {
          value: ethers.utils.parseUnits(price, 18),
        }
      );
      await createItem.wait();
    } catch {
      console.log("Something went wrong");
    }
  };

  const getAllShipments = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipments = await contract.getAllTransactions();
      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));

      return allShipments;
    } catch (error) {
      console.log("error: not getting shipments");
    }
  }

  const getShipmentsCount = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentsCount(accounts[0]);
      console.log(shipmentsCount.toNumber());
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("error: not getting shipment", error);
    }
  };

  const completeShipment = async (completeShip) => {
    console.log(completeShip);

    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install MetaMask" 

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );

      transaction.wait();
      console.log(transaction);
    } catch (error) {
      console.log("wrong completeShipment", error);
    }
  };

  const getShipment = async (index) => {
    console.log(index * 1);
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index * 1);

      const SingleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };

      return SingleShipment;
    } catch (error) {
      console.log("sorry no shipment");
    }
  };

  const startShipment = async (getProduct) => {
    const { receiver, index } = getProduct;

    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index * 1
      );

      shipment.wait();
      console.log(shipment);
    } catch (error) {
      console.log("Sorry no shipment", error)
    }
  };

  const getAccountBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const balance = provider.getBalance(accounts[0]);

    return balance;
  }

  // ---CHECK WALLET CONNECTED---
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account"
      }
    } catch {
      return "not connected"
    }
  };

  // ---CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth _requestAccounts",
      });

      setCurrentUser(accounts[0]);
    } catch {
      return "Something went wrong";
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipments,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentsCount,
        DappName,
        currentUser,
        getAccountBalance
      }}
    >
      {children}
    </TrackingContext.Provider>
  )
}