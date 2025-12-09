// flightSummaryData.js
export const flightSummaryData = {
    flightInfo: {
        flightNumber: "BS 217",
        departure: "24/11/2025 09:50",
        route: "DAC/BKK",
        segmentClass: "Y"
    },
    paxSummary: {
        totalPlanned: 186, // TTL:186 from the summary line
        adults: 183,
        children: 3,
        infants: 1,
        domestic: 1, // DT=1
        international: 0, // INT=0
        totalActualPax: 187 // Total Pax line
    },
    weightSummary: {
        totalPaxNumber: 187,
        totalPaxWeight: 13685.00,
        totalCrewNumber: 12,
        totalCrewWeight: 612.00,
        adultsWeight: 13570.00,
        menNumber: 152,
        menWeight: 11400.00,
        womenNumber: 31,
        womenWeight: 2170.00,
        childrenWeight: 105.00,
        infantsWeight: 10.00,
        holdLuggageNumber: 135,
        holdLuggageWeight: 1474.00,
        totalLuggageWeight: 1474.00,
        totalCargoWeight: 0.00,
        totalFuelWeight: 0.00,
        totalMailWeight: 0.00,
        totalActualWeight: 15771.00 // The final TOTAL
    },
    operationalNotes: {
        totalNoShow: 0,
        totalGoShow: 0,
        totalPAD: 3, // Passenger Accepted for Carriage (PAD) / Pilot in command Discretion
        totalPAG: 3, // Passenger Accepted on Ground (PAG) / Passenger Accepted for Grounding
        totalJumpSeats: 6,
        excessBaggageKG: 0.00,
        excessBaggageAmountBDT: 0.00
    }
};