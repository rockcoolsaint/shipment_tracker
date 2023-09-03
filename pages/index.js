import StartShipment from '@/components/StartShipment';
import { TrackingContext } from '@/context/TrackingContext';
import React, { useContext, useEffect, useState } from 'react'

// INTERNAL IMPORT
import { CompleteShipment, Form, GetShipment, Profile, Services, Table } from "../components/index";

const index = () => {
  const { currentUser, createShipment, completeShipment, getAllShipments, getShipment, startShipment, getShipmentsCount, getAccountBalance } = useContext(TrackingContext);

  // STATE VARIABLE
  const [createShipmentModal, setCreateShipmentModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  // DATA STATE VARIABLE
  const [allShipmentsData, setAllShipmentsData] = useState();

  useEffect(() => {
    const getCampaignsData = getAllShipments();
    
    return async () => {
      const allData = await getCampaignsData;
      console.log(allData)
      setAllShipmentsData(allData);
    }
  }, []);

  return (
    <>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModal={setGetModal}
        setStartModal={setStartModal}
      />
      <Table
        setCreateShipmentModal={setCreateShipmentModal}
        allShipmentsData={allShipmentsData}
      />
      <Form
        createShipmentModal={createShipmentModal}
        createShipment={createShipment}
        setCreateShipmentModal={setCreateShipmentModal}
      />
      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getShipmentsCount={getShipmentsCount}
        getAccountBalance={getAccountBalance}
      />
      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
      />
      <GetShipment
        getModal={getModal}
        setGetModal={setGetModal}
        getShipment={getShipment}
      />
      <StartShipment
        startModal={startModal}
        setStartModal={setStartModal}
        startShipment={startShipment}
      />
    </>
  )
}

export default index;