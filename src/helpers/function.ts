// const booleanTransformer = {
//     to: (value: boolean) => (value ? 1 : 0), // เซฟลง DB เป็น 1 หรือ 0
//     from: (value: any) => {
//         if (value === null || value === undefined) return false;

//         // ถ้าเป็น Buffer (มักเกิดกับ type: 'bit')
//         if (Buffer.isBuffer(value)) {
//             return value[0] === 1;
//         }

//         // ถ้าเป็น number หรือ boolean อยู่แล้ว (มักเกิดกับ type: 'tinyint')
//         return value == 1 || value === true;
//     }
// };

const booleanTransformer = {
  // แก้ไขส่วน to: ให้รองรับ null/undefined ก่อนเซฟลง DB
  to: (value: boolean | null | undefined) => {
    if (value === null || value === undefined) return null;
    return value ? 1 : 0;
  },

  from: (value: any) => {
    // ถ้าเป็น null หรือ undefined ให้คืนค่า null กลับไป (เพื่อให้ Entity เป็น null)
    if (value === null || value === undefined) return null;

    // ถ้าเป็น Buffer (กรณีใช้ type: 'bit' ใน MSSQL หรือบาง Driver)
    if (Buffer.isBuffer(value)) {
      return value[0] === 1;
    }

    // กรณีทั่วไป (tinyint) เช็คว่าเป็น 1 หรือ true หรือไม่
    return value == 1 || value === true;
  },
};

export { booleanTransformer };
