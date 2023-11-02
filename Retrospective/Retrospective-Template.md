TEMPLATE FOR RETROSPECTIVE (Team 13)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 

4 stories committed, 4 stories done

- Total points committed vs. done 

8 points committed, 8 points done

- Nr of hours planned vs. spent (as a team)

56 hours planned, 55.35 spent

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#1_   |     6    |    2   |      11:30      |     4:40         |
| _#2_   |     6    |    1   |       8:30      |     4:30         |
| _#3_   |     6    |    2   |      15:30      |     9:55         |
| _#4_   |     N/A  |    5   |                 |                  |
| _#5_   |     6    |    3   |      14:30      |     11:40        |
| _#6_   |     N/A  |    5   |                 |                  |
| _#0_   |     4    |        |      6:00       |     20:45        |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Average hours per task = 2.34H - 140M / 1.67H - 100M (excluding Task #18)
- Standard deviation for estimation: 57.6 / for actual time: 195.3 / for actual time excluding Task #18 "sprint planning": 62.9 (calculation based on Minutes)
- Total task estimation error ratio: 56/(51.5-1) = 1.1H - 66M

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated : 8:30h
  - Total hours spent : 04:25h
  - Nr of automated unit test cases : 17
  - Coverage : 78.26%
- E2E testing:
  - Total hours estimated : 7:00h
  - Total hours spent : 3:00h
- Code review 
  - Total hours estimated : 12:30 h
  - Total hours spent : 06:30 h
  


## ASSESSMENT

In this sprint we made numerous mistakes. 

First of all, we underestimated the time needed to perform some tasks, in particular those related to the management of the sprint itself. In our defense we can say that it was the first time we had to organize a sprint and that this error was caused by our inexperience. For the next sprint we will be able to base our estimates on the actual time it took in this iteration.

Another problem we encountered was the difficulty of documenting code written by other people. For the next sprints, whoever writes a piece of code will also have to document it.

We lost a substantial number of hours managing the git repository, particularly merges and conflict resolution. Unfortunately there is no solution to this problem: from now on we will have to consider in each sprint a task (unrelated to any user story) for maintaining the repository.

In this sprint we started immediately with the aim of completing 4 US. Therefore, we decided to work in parallel on all 4 at the same time. This was a mistake because when the team works on 4 different stories, synchronization between members becomes extremely difficult. in the end we still managed to reach our goal but from next time we will have to try to work on a maximum of 2 US at a time: as soon as we finish one we start another. We cannot disperse our energies on too many US at the same time

Finally, what we believe to be our biggest mistake: we did not include a task for the design of the system in our boards. Immediately after identifying the requirements (i.e. the user stories), we moved on to setting up the back end and front end. If before doing this we had spent at least an hour thinking about how to implement the solutions, we would not have had the problem of rewriting the database multiple times. Until the very last day we had problems understanding what each table did resulting in slowdowns on our roadmap and the production of numerous unstable intermediate versions.

Even though we had all these problems, we still managed to deliver everything we set out to deliver. Not only that: excluding the tasks related to the organization of the sprint, all the others were finished earlier than expected. We also got to learn new programming techniques and new frameworks. Despite everything, we can consider this sprint a great success!


