import React, { useState } from 'react';
import { passengerData } from './passengerData';
import { flightSummaryData } from './flightSummaryData';

const TableRow = ({ label, number, weight }) => (
    <div className='grid grid-cols-12'>
        <div className='col-span-7 p-1 text-left whitespace-nowrap'>{label}</div>
        <div className='col-span-2 p-1 text-center'>{number !== undefined ? number : ''}</div>
        <div className='col-span-3 p-1 text-right whitespace-nowrap'>{weight !== undefined ? weight.toFixed(2) : ''}</div>
    </div>
);

const EmailModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSend = () => {
        console.log(`Attempting to send manifest to: ${email}`);
        alert(`Manifest simulated sent to: ${email}`);
        setEmail('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Send Manifest via Email</h3>
                <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!email}
                        className={`px-4 py-2 text-white rounded-md transition duration-150 ${
                            email ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
                        }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

const PassengerManifestContent = ({ data, openMailModal }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="relative">
            
            <div className='absolute top-0 right-0 flex gap-2'>
                <button 
                    onClick={handlePrint} 
                    className='px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition duration-150 print:hidden'
                >
                    🖨️ Print
                </button>
                <button 
                    onClick={openMailModal} 
                    className='px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition duration-150 print:hidden'
                >
                    📧 Mail
                </button>
            </div>
            
            <div className='flex justify-center item-center pb-4 font-sans text-xl font-bold'>Passenger Manifest</div>
            
            <div className='grid grid-cols-12 gap-4 grid-flow-dense mx-auto max-w-5xl items-center text-sm'>
                <div className="col-span-4 p-2 text-center">AIRLINE: US-BANGLA </div>
                <div className="col-span-4 p-2 text-center">FLIGHT: BS217/24NOV</div>
                <div className="col-span-4 p-2 text-center">DATE: 24-11-25 12:02</div>
                <div className="col-span-4 p-2 text-center">ROUTING: DAC/BKK</div>
                <div className="col-span-4 p-2 text-center">A/C REG: S2-AJH</div>
                <div className="col-span-4 p-2 text-center">STD: 09:50 LT</div>
                <div className="col-span-4 p-2 text-center">BOARDING CITY: DAC</div>
                <div className="col-span-4 p-2 text-center">DESTINATION CITY: BKK</div>
                <div className="col-span-4 p-2 text-center"></div>

                <div className="col-span-12 border-b border-zinc-400 my-2"></div>

                <div className="col-span-4 p-2 text-center font-bold">SNO NAME</div>
                <div className="col-span-4 p-2 text-center font-bold">BNO SNQ R/LOC DT/INT GN INF P/WT</div>
                <div className="col-span-4 p-2 text-center font-bold">PSPT/CN</div>

                <div className="col-span-12 border-b border-zinc-400 my-2"></div>
                
                <div className="col-span-12 text-center font-semibold">
                    DAC-BKK CLASS Y
                </div>
            </div>
            
            <div className='mt-4 grid grid-cols-12 gap-4 grid-flow-dense mx-auto max-w-5xl text-sm'>
                {passengerData.map((passenger) => (
                    <React.Fragment key={passenger.id}>
                        <div className='col-span-4 p-1 text-center whitespace-nowrap overflow-hidden text-ellipsis'>
                            <span className='font-bold mr-2'>{passenger.id}</span>
                            {passenger.name}
                        </div>
                        <div className='col-span-4 p-1 text-center whitespace-nowrap'>
                            <span className='mr-3'>{passenger.number1}</span> 
                            <span className='mr-3 font-bold'>{passenger.seatno}</span>
                            <span className='mr-3'>{passenger.code2}</span>
                            <span className='mr-3'>{passenger.genderCode}</span>
                            <span className='mr-3'>{passenger.baggage}</span>
                        </div>
                        <div className='col-span-4 p-1 text-center whitespace-nowrap overflow-hidden text-ellipsis'>
                            {passenger.passportID}
                        </div>
                    </React.Fragment>
                ))}
            </div>
            
            <div className='mt-9 mx-auto max-w-5xl text-sm'>
                <div className='flex flex-row gap-8 '>
                    <div className=''>Segment: DAC/BKK</div>
                    <div className=''>Class: K</div>
                    <div className=''>Total: 186</div>
                    <div className=''>Infant: 1</div>
                </div>
                <div className='flex flex-row gap-8 '>
                    <div className=''>TTL: 186</div>
                    <div className=''>Y = 186</div>
                    <div className=''>CHD = 3</div>
                    <div className=''>INF = 1</div>
                    <div className=''>DT = 1</div>
                    <div className=''>INT = 0</div>
                </div>
                <div className='mt-2'>Flight Number: BS217</div>
                <div>Departure : 24/11/2025 09:50 </div>
            </div>

            <div className='mt-8 mx-auto max-w-5xl text-sm'>
                
                <div className='grid grid-cols-12 font-bold border-b border-gray-500 pb-1 mb-1'>
                    <div className='col-span-7 p-1 text-left'></div>
                    <div className='col-span-2 p-1 text-center'>Number</div>
                    <div className='col-span-3 p-1 text-right'>Real Weights (Kg)</div>
                </div>

                <TableRow label="Total Pax:" number={data.weightSummary.totalPaxNumber} weight={data.weightSummary.totalPaxWeight} />
                <TableRow label="Total Crew:" number={data.weightSummary.totalCrewNumber} weight={data.weightSummary.totalCrewWeight} />
                <TableRow label="Adults:" number={data.weightSummary.adultsWeight ? data.paxSummary.adults : undefined} weight={data.weightSummary.adultsWeight} />
                <TableRow label="Men:" number={data.weightSummary.menNumber} weight={data.weightSummary.menWeight} />
                <TableRow label="Women:" number={data.weightSummary.womenNumber} weight={data.weightSummary.womenWeight} />
                <TableRow label="Children:" number={data.paxSummary.children} weight={data.weightSummary.childrenWeight} />
                <TableRow label="Infants:" number={data.paxSummary.infants} weight={data.weightSummary.infantsWeight} />
                
                <div className='border-t border-gray-300 my-1'></div>
                <TableRow label="Total Hold Luggage:" number={data.weightSummary.holdLuggageNumber} weight={data.weightSummary.holdLuggageWeight} />
                <TableRow label="Total Cabin Luggage:" number={0} weight={0.00} />
                <TableRow label="Total Pax Luggage:" number={data.weightSummary.holdLuggageNumber} weight={data.weightSummary.totalLuggageWeight} />
                <TableRow label="Total Rush Luggage:" number={0} weight={0.00} />
                <TableRow label="Total Luggage:" number={data.weightSummary.holdLuggageNumber} weight={data.weightSummary.totalLuggageWeight} />
                
                <div className='border-t border-gray-300 my-1'></div>
                <TableRow label="Total Cargo:" weight={data.weightSummary.totalCargoWeight} />
                <TableRow label="Total Fuel:" weight={data.weightSummary.totalFuelWeight} />
                <TableRow label="Total Mail:" weight={data.weightSummary.totalMailWeight} />

                <div className='border-t-2 border-black mt-1 pt-1 font-extrabold'>
                    <TableRow label="TOTAL" weight={data.weightSummary.totalActualWeight} />
                </div>
                
                <div className='mt-6 grid grid-cols-12'>
                    <div className='col-span-6'>
                        <div className='mb-2'>Total Planned: <span className='font-bold'>{data.paxSummary.totalPlanned}</span></div>
                        <div>Total NoShow: <span className='font-bold'>{data.operationalNotes.totalNoShow}</span></div>
                        <div>Total GoShow: <span className='font-bold'>{data.operationalNotes.totalGoShow}</span></div>
                        <div>Total PAD: <span className='font-bold'>{data.operationalNotes.totalPAD}</span></div>
                        <div>Total PAG: <span className='font-bold'>{data.operationalNotes.totalPAG}</span></div>
                        <div>Total Jump Seats: <span className='font-bold'>{data.operationalNotes.totalJumpSeats}</span></div>
                    </div>
                    <div className='col-span-6 text-right'>
                        <div className='mb-2'>Excess baggage (including ancillaries): <span className='font-bold'>{data.operationalNotes.excessBaggageKG.toFixed(2)} kg</span></div>
                        <div>Excess baggage amount (excluding ancillaries): <span className='font-bold'>{data.operationalNotes.excessBaggageAmountBDT.toFixed(2)} BDT</span></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const TempManifestContent = () => (
    <div className='flex justify-center items-center h-full'>
        <p className='text-2xl text-gray-400'>Temporary Passenger Manifest Content goes here...</p>
    </div>
);


const ReportsView = () => {
    const [selectedTab, setSelectedTab] = useState('manifest');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const data = flightSummaryData; 

    const renderContent = () => {
        switch (selectedTab) {
            case 'manifest':
                return <PassengerManifestContent data={data} openMailModal={() => setIsModalOpen(true)} />;
            case 'temp-manifest':
                return <TempManifestContent />;
            default:
                return null;
        }
    };

    const getTabClass = (tabName) => 
        `p-3 text-lg text-center cursor-pointer transition-colors duration-200 
         ${selectedTab === tabName 
            ? 'bg-blue-600 text-white font-semibold' 
            : 'hover:bg-blue-100 text-gray-700'
         }`;


    return (
        // REMOVED 'h-screen' from this div, allowing the content to define the page height
        <div className='flex ml-4 p-2'> 
            
            <div className='flex-col gap-4 border rounded-lg border-zinc-200 h-1/4'>
                <div 
                    className={getTabClass('manifest')}
                    onClick={() => setSelectedTab('manifest')}
                >
                    Passenger Manifest
                </div>
                <div 
                    className={getTabClass('temp-manifest')}
                    onClick={() => setSelectedTab('temp-manifest')}
                >
                    Temporary Passenger Manifest
                </div>
            </div>
            
            {/* The main content area now expands with its content */}
            <div className='ml-4 flex-1 border font-mono p-4'>
                {renderContent()}
            </div>

            <EmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ReportsView;