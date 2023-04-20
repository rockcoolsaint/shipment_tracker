import StartShipment from '@/components/StartShipment';
import { TrackingContext } from '@/context/TrackingContext';
import React, { useContext, useEffect, useState } from 'react'

// INTERNAL IMPORT
import { CompleteShipment, Form, GetShipment, Profile, Services, Table } from "../components/index";

const index = () => {
  const { currentUser, createShipment, completeShipment, getAllShipments, getShipment, startShipment, getShipmentsCount,  } = useContext(TrackingContext);

  // STATE VARIABLE
  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModel, setGetModel] = useState(false);
  // DATA STATE VARIABLE
  const [allShipmentsData, setAllShipmentsData] = useState();

  useEffect(() => {
    const getCampaignsData = getAllShipments();
    
    return async () => {
      const allData = await getCampaignsData;
      setAllShipmentsData(allData);
    }
  }, []);

  return (
    <>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModel={setGetModel}
        setStartModal={setStartModal}
      />
      <Table
        setCreateShipmentModel={setCreateShipmentModel}
        allShipmentsData={allShipmentsData}
      />
      <Form
        createShipmentModel={createShipmentModel}
        createShipment={createShipment}
        setCreateShipmentModel={setCreateShipmentModel}
      />
      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getShipmentsCount={getShipmentsCount}
      />
      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
      />
      <GetShipment
        getModel={getModel}
        setGetModel={setGetModel}
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