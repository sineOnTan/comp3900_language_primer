import express, { Request, Response } from 'express';
import cors from 'cors';

// ==================================
// ==========Edge Cases==============
// =====Getting a deleted group id=== 
// =========to delete================ Throws an error that the group was not found.


// NOTE: you may modify these interfaces
interface Student {
  id: number;
  name: string;
}

interface GroupSummary {
  id: number;
  groupName: string;
  members: number[];
}

interface Group {
  id: number;
  groupName: string;
  members: Student[];
}

const app = express();
const port = 3902;

app.use(cors());
app.use(express.json());

const groupsSum: GroupSummary[] = []
const groups: Group[] = []
const students: Student[] = []
var curGroupId: number = 1


/**
 * Route to get all groups
 * @route GET /api/groups
 * @returns {Array} - Array of group objects
 */
app.get('/api/groups', (req: Request, res: Response) => {
  // // TODO: (sample response below)
  res.json(groupsSum)
});

/**
 * Route to get all students
 * @route GET /api/students
 * @returns {Array} - Array of student objects
 */
app.get('/api/students', (req: Request, res: Response) => {
  // TODO: (sample response below)
  // res.json([
  //   { id: 1, name: 'Alice' },
  //   { id: 2, name: 'Bob' },
  //   { id: 3, name: 'Charlie' },
  //   { id: 4, name: 'David' },
  //   { id: 5, name: 'Eve' },
  // ]);
  res.json(students)
});

/**
 * Route to add a new group
 * @route POST /api/groups
 * @param {string} req.body.groupName - The name of the group
 * @param {Array} req.body.members - Array of member names
 * @returns {Object} - The created group object
 */
app.post('/api/groups', (req: Request, res: Response) => {
  // TODO: implement storage of a new group and return their info (sample response below)
  // res.json({
  //   id: 3,
  //   groupName: 'New Group',
  //   members: [1, 2],
  // });
  req.body.members.forEach((element: any) => {
    students.push({id: students.length, name: element})
  });

  const memberNumbers: number[] = req.body.members.map((name: any) => students.find(student => student.name === name)).map((student: { id: any; }) => student.id)
  const memberDetails: Student[] = req.body.members.map((name: any) => students.find(student => student.name === name))

  const newID = curGroupId
  curGroupId += 1

  const tempGroupSum: GroupSummary = {
    id: newID,
    groupName: req.body.groupName,
    members: memberNumbers
  };

  const tempGroup: Group = {
    id: newID,
    groupName: req.body.groupName,
    members: memberDetails
  };

  groupsSum.push(tempGroupSum)
  groups.push(tempGroup)
  res.json(tempGroupSum)

});

/**
 * Route to delete a group by ID
 * @route DELETE /api/groups/:id
 * @param {number} req.params.id - The ID of the group to delete
 * @returns {void} - Empty response with status code 204
 */
app.delete('/api/groups/:id', (req: Request, res: Response) => {
  // TODO: (delete the group with the specified id)
  console.log("hi")
  const indexRemove: number | undefined = groupsSum.findIndex(group => group.id === Number(req.params.id))
  if (indexRemove !== undefined) {
    groupsSum.splice(indexRemove, 1)
    groups.splice(indexRemove, 1)
  } else {
    res.status(404).send("Group not found");
  }
  res.sendStatus(204); // send back a 204 (do not modify this line)
});

/**
 * Route to get a group by ID (for fetching group members)
 * @route GET /api/groups/:id
 * @param {number} req.params.id - The ID of the group to retrieve
 * @returns {Object} - The group object with member details
 */
app.get('/api/groups/:id', (req: Request, res: Response) => {
  // TODO: (sample response below)
  // res.json(groups.find(group => group.id === Number(req.params.id)));

  const group: Group | undefined = groups.find(group => group.id === Number(req.params.id))
  console.log("hi")
  if (group !== undefined) {
    console.log(group)
    res.json(group)
  }
  else {
    res.status(404).send("Group not found");
  }
  // res.json({
  //   id: 1,
  //   groupName: 'Group 1',
  //   members: [
  //     { id: 1, name: 'Alice' },
  //     { id: 2, name: 'Bob' },
  //     { id: 3, name: 'Charlie' },
  //   ],
  // })
  /* TODO:
   * if (group id isn't valid) {
   *   res.status(404).send("Group not found");
   * }
   */
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

