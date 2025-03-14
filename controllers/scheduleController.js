const { Schedule, Class, Employee, Subject, sequelize, User } = require("../models");
const { Op } = require("sequelize");

const createSchedule = async (req, res) => {
  const { idClass, idSubject, idEmployee, date, weekDay, startTime, endTime, roomNumber } = req.body;
  try {
    const schedule = await Schedule.create({
      id_class: idClass,
      id_subject: idSubject,
      id_employee: idEmployee,
      date,
      week_day: weekDay,
      start_time: startTime,
      end_time: endTime,
      room_number: roomNumber,
    });

    const createdSchedule = await Schedule.findByPk(schedule.id_schedule, {
      include: [
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        }
      ],
    });

    const formattedSchedule = {
      idSchedule: createdSchedule.id_schedule,
      subject: {
        idSubject: createdSchedule.Subject.id_subject,
        subjectName: createdSchedule.Subject.name,
      },
      date: createdSchedule.date,
      weekDay: createdSchedule.week_day,
      startTime: createdSchedule.start_time,
      endTime: createdSchedule.end_time,
      roomNumber: createdSchedule.room_number,
      class: createdSchedule.Class ? {
        idClass: createdSchedule.Class.id_class,
        classNumber: createdSchedule.Class.class_number,
        classLetter: createdSchedule.Class.class_letter,
      } : null,
      employee: createdSchedule.Employee ? {
        idEmployee: createdSchedule.Employee.id_employee,
        firstName: createdSchedule.Employee.User.first_name,
        lastName: createdSchedule.Employee.User.last_name,
        middleName: createdSchedule.Employee.User.middle_name,
      } : null,
    };

    res.status(201).json({ message: "Schedule created successfully", data: formattedSchedule });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteScheduleById = async (req, res) => {
  const { idSchedule } = req.params;
  try {
    const schedule = await Schedule.findByPk(idSchedule);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    await schedule.destroy();
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateScheduleById = async (req, res) => {
  const { idSchedule } = req.params;
  const { idClass, idSubject, idEmployee, date, weekDay, startTime, endTime, roomNumber } = req.body;
  try {
    const schedule = await Schedule.findByPk(idSchedule);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    schedule.id_class = idClass;
    schedule.id_subject = idSubject;
    schedule.id_employee = idEmployee;
    schedule.date = date;
    schedule.week_day = weekDay;
    schedule.start_time = startTime;
    schedule.end_time = endTime;
    schedule.room_number = roomNumber;
    await schedule.save();

    const updatedSchedule = await Schedule.findByPk(schedule.id_schedule, {
      include: [
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        }
      ],
    });

    const formattedSchedule = {
      idSchedule: updatedSchedule.id_schedule,
      subject: {
        idSubject: updatedSchedule.Subject.id_subject,
        subjectName: updatedSchedule.Subject.name,
      },
      date: updatedSchedule.date,
      weekDay: updatedSchedule.week_day,
      startTime: updatedSchedule.start_time,
      endTime: updatedSchedule.end_time,
      roomNumber: updatedSchedule.room_number,
      class: updatedSchedule.Class ? {
        idClass: updatedSchedule.Class.id_class,
        classNumber: updatedSchedule.Class.class_number,
        classLetter: updatedSchedule.Class.class_letter,
      } : null,
      employee: updatedSchedule.Employee ? {
        idEmployee: updatedSchedule.Employee.id_employee,
        firstName: updatedSchedule.Employee.User.first_name,
        lastName: updatedSchedule.Employee.User.last_name,
        middleName: updatedSchedule.Employee.User.middle_name,
      } : null,
    };

    res.status(200).json({ message: "Schedule updated successfully", data: formattedSchedule });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getScheduleByClass = async (req, res) => {
  const { idClass } = req.params;
  try {
    const schedules = await Schedule.findAll({
      where: { id_class: idClass },
      include: [
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        }
      ],
    });

    const formattedSchedules = schedules.map(schedule => ({
      idSchedule: schedule.id_schedule,
      subject: {
        idSubject: schedule.Subject.id_subject,
        subjectName: schedule.Subject.name,
      },
      date: schedule.date,
      weekDay: schedule.week_day,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      roomNumber: schedule.room_number,
      class: schedule.Class ? {
        idClass: schedule.Class.id_class,
        classNumber: schedule.Class.class_number,
        classLetter: schedule.Class.class_letter,
      } : null,
      employee: schedule.Employee ? {
        idEmployee: schedule.Employee.id_employee,
        user: schedule.Employee.User ? {
          idUser: schedule.Employee.User.id_user,
          firstName: schedule.Employee.User.first_name,
          lastName: schedule.Employee.User.last_name,
          middleName: schedule.Employee.User.middle_name,
        } : null,
      } : null,
    }));

    res.status(200).json({ message: "Schedules fetched successfully", data: formattedSchedules });
  } catch (error) {
    console.error("Error fetching schedules by class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getScheduleByEmployee = async (req, res) => {
  const { idEmployee } = req.params;
  try {
    const schedules = await Schedule.findAll({
      where: { id_employee: idEmployee },
      include: [
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ]
        },
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        }
      ],
    });

    const formattedSchedules = schedules.map(schedule => ({
      idSchedule: schedule.id_schedule,
      subject: {
        idSubject: schedule.Subject.id_subject,
        subjectName: schedule.Subject.name,
      },
      date: schedule.date,
      weekDay: schedule.week_day,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      roomNumber: schedule.room_number,
      class: schedule.Class ? {
        idClass: schedule.Class.id_class,
        classNumber: schedule.Class.class_number,
        classLetter: schedule.Class.class_letter,
      } : null,
      employee: schedule.Employee ? {
        idEmployee: schedule.Employee.id_employee,
        firstName: schedule.Employee.User.first_name,
        lastName: schedule.Employee.User.last_name,
        middleName: schedule.Employee.User.middle_name,
      } : null,
    }));

    res.status(200).json({ message: "Schedules fetched successfully", data: formattedSchedules });
  } catch (error) {
    console.error("Error fetching schedules by employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getClassScheduleByWeekInterval = async (req, res) => {
  const { idClass, startDate, endDate } = req.params;
  try {
    const schedules = await Schedule.findAll({
      where: {
        id_class: idClass,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ]
        },
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        }
      ],
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });

    const groupedSchedules = schedules.reduce((acc, schedule) => {
      const formattedSchedule = {
        idSchedule: schedule.id_schedule,
        subject: {
          idSubject: schedule.Subject.id_subject,
          subjectName: schedule.Subject.name,
        },
        date: schedule.date,
        weekDay: schedule.week_day,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        roomNumber: schedule.room_number,
        class: schedule.Class ? {
          idClass: schedule.Class.id_class,
          classNumber: schedule.Class.class_number,
          classLetter: schedule.Class.class_letter,
        } : null,
        employee: schedule.Employee ? {
          idEmployee: schedule.Employee.id_employee,
          firstName: schedule.Employee.User.first_name,
          lastName: schedule.Employee.User.last_name,
          middleName: schedule.Employee.User.middle_name,
        } : null,
      };

      if (!acc[schedule.date]) {
        acc[schedule.date] = [];
      }
      acc[schedule.date].push(formattedSchedule);
      return acc;
    }, {});

    res.status(200).json({ message: "Class schedule fetched successfully", data: groupedSchedules });
  } catch (error) {
    console.error("Error fetching class schedule by week interval:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployeeScheduleByWeekInterval = async (req, res) => {
  const { idEmployee, startDate, endDate } = req.params;
  try {
    const schedules = await Schedule.findAll({
      where: {
        id_employee: idEmployee,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ]
        },
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        }
      ],
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });

    const groupedSchedules = schedules.reduce((acc, schedule) => {
      const formattedSchedule = {
        idSchedule: schedule.id_schedule,
        subject: {
          idSubject: schedule.Subject.id_subject,
          subjectName: schedule.Subject.name,
        },
        date: schedule.date,
        weekDay: schedule.week_day,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        roomNumber: schedule.room_number,
        class: schedule.Class ? {
          idClass: schedule.Class.id_class,
          classNumber: schedule.Class.class_number,
          classLetter: schedule.Class.class_letter,
        } : null,
        employee: schedule.Employee ? {
          idEmployee: schedule.Employee.id_employee,
          firstName: schedule.Employee.User.first_name,
          lastName: schedule.Employee.User.last_name,
          middleName: schedule.Employee.User.middle_name,
        } : null,
      };

      if (!acc[schedule.date]) {
        acc[schedule.date] = [];
      }
      acc[schedule.date].push(formattedSchedule);
      return acc;
    }, {});

    res.status(200).json({ message: "Employee schedule fetched successfully", data: groupedSchedules });
  } catch (error) {
    console.error("Error fetching employee schedule by week interval:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSchedule,
  deleteScheduleById,
  updateScheduleById,
  getScheduleByClass,
  getScheduleByEmployee,
  getClassScheduleByWeekInterval,
  getEmployeeScheduleByWeekInterval,
};