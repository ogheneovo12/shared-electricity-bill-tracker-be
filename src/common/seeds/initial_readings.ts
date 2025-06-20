import { RoomEnum } from 'src/rooms/rooms.schema';

// initial-readings.js
export const initialReadings = [
  {
    room: RoomEnum.ROOM_A,
    date: new Date('2024-06-20'),
    value: -28.3, // Monique's last reading
    notes: 'Initial reading from Excel import',
  },
  {
    room: RoomEnum.ROOM_B,
    date: new Date('2024-06-20'),
    value: 229.8, // Peter's last reading
    notes: 'Initial reading from Excel import',
  },
  {
    room: RoomEnum.ROOM_C,
    date: new Date('2024-06-20'),
    value: 357.8, // Sabona's last reading
    notes: 'Initial reading from Excel import',
  },
  {
    room: RoomEnum.ROOM_D,
    date: new Date('2024-06-20'),
    value: 671.2, // Ogheneovo's last reading
    notes: 'Initial reading from Excel import',
  },
];

export const currentReadings = [
  {
    room: RoomEnum.ROOM_A,
    date: new Date('2025-03-04'),
    value: 1042.6, // Monique's last reading
    notes: 'Initial reading from Excel import',
  },
  {
    room: RoomEnum.ROOM_B,
    date: new Date('2025-03-04'),
    value: 297.41, // Peter's last reading
    notes: 'Initial reading from Excel import',
  },
  {
    room: RoomEnum.ROOM_C,
    date: new Date('2025-03-04'),
    value: 1190.4, // Sabona's last reading
    notes: 'Initial reading from Excel import',
  },
  {
    room: RoomEnum.ROOM_D,
    date: new Date('2025-03-04'),
    value: 1380.3, // Ogheneovo's last reading
    notes: 'Initial reading from Excel import',
  },
];

export const purchaseHistory = [
  {
    date_purchased: new Date('2024-06-20'),
    total_amount: 18175,
    total_units: 270.5,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 4875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 2500,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 6800,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 4000,
      },
    ],
  },
  {
    date_purchased: new Date('2024-07-17'),
    total_amount: 4500,
    total_units: 67.5,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 1500,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 3000,
      },
    ],
  },
  {
    date_purchased: new Date('2024-07-27'),
    total_amount: 4750,
    total_units: 70.7,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 3875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 0,
      },
    ],
  },
  {
    date_purchased: new Date('2024-08-06'),
    total_amount: 20848,
    total_units: 310.9,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 6875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 6875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 7098,
      },
    ],
  },
  {
    date_purchased: new Date('2024-09-13'),
    total_amount: 13625,
    total_units: 203.3,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 1875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 8375,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 3375,
      },
    ],
  },
  {
    date_purchased: new Date('2024-10-04'),
    total_amount: 2000,
    total_units: 69.4,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 2000,
      },
    ],
  },
  {
    date_purchased: new Date('2024-10-12'),
    total_amount: 5000,
    total_units: 74.4,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 5000,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 0,
      },
    ],
  },
  {
    date_purchased: new Date('2024-10-23'),
    total_amount: 11875,
    total_units: 176.8,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 5000,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 6875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 0,
      },
    ],
  },
  {
    date_purchased: new Date('2024-11-11'),
    total_amount: 11625,
    total_units: 127,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 4875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 1875,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 4875,
      },
    ],
  },
  {
    date_purchased: new Date('2024-11-24'),
    total_amount: 16542,
    total_units: 246.2,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 11875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 4667,
      },
    ],
  },
  {
    date_purchased: new Date('2024-12-29'),
    total_amount: 27625,
    total_units: 411.8,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 8875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 7875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 10875,
      },
    ],
  },
  {
    date_purchased: new Date('2025-01-23'),
    total_amount: 9250,
    total_units: 136.3,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 5875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 3375,
      },
    ],
  },
  {
    date_purchased: new Date('2025-01-31'),
    total_amount: 14000,
    total_units: 208.4,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 3125,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 6875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 4000,
      },
    ],
  },
  {
    date_purchased: new Date('2025-02-14'),
    total_amount: 19625,
    total_units: 307.6,
    contributions: [
      {
        room: RoomEnum.ROOM_A,
        amount: 8875,
      },
      {
        room: RoomEnum.ROOM_B,
        amount: 0,
      },
      {
        room: RoomEnum.ROOM_C,
        amount: 6875,
      },
      {
        room: RoomEnum.ROOM_D,
        amount: 3875,
      },
    ],
  },
];

export function getSummary() {
  const initial_reading_total = initialReadings.reduce((acc, curr) => {
    acc += curr.value;
    return acc;
  }, 0);

  const current_reading_total = currentReadings.reduce((acc, curr) => {
    acc += curr.value;
    return acc;
  }, 0);

  const purchased_amount_total = purchaseHistory.reduce((acc, curr) => {
    acc += curr.total_amount;
    return acc;
  }, 0);

  const purchased_units = purchaseHistory.reduce((acc, curr) => {
    acc += curr.total_units;
    return acc;
  }, 0);

  const room_summary = purchaseHistory.reduce(
    (acc, curr) => {
      const rate = curr.total_amount / curr.total_units;

      curr.contributions.forEach((con) => {
        if (!acc[con.room]) {
          acc[con.room] = {
            total_purchased_amount: con.amount,
            total_unit_allocated: con.amount / rate,
          };
        } else {
          acc[con.room].total_purchased_amount =
            acc[con.room].total_purchased_amount + con.amount;
          acc[con.room].total_unit_allocated =
            acc[con.room].total_unit_allocated + con.amount / rate;
        }
      });
      return acc;
    },
    {} as Record<
      string,
      { total_purchased_amount: number; total_unit_allocated: number }
    >,
  );

  const total_allocated_units = Object.values(room_summary).reduce(
    (acc, curr) => acc + curr.total_unit_allocated,
    0,
  );

  console.log({
    initial_reading_total,
    current_reading_total,
    purchased_amount_total,
    purchased_units,
    room_summary,
    total_allocated_units,
  });
}
