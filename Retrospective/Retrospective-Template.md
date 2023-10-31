TEMPLATE FOR RETROSPECTIVE (Team ##)
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

56 hours planned, 55h15 spent

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |         |       |            |              |
| n      |         |        |            |              |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 
  - Total hours spent
  


## ASSESSMENT

In this sprint we made numerous mistakes. 

First of all, we underestimated the time needed to perform some tasks, in particular those related to the management of the sprint itself. In our defense we can say that it was the first time we had to organize a sprint and that this error was caused by our inexperience. For the next sprint we will be able to base our estimates on the actual time it took in this iteration.

Another problem we encountered was the difficulty of documenting code written by other people. For the next sprints, whoever writes a piece of code will also have to document it.

We lost a substantial number of hours managing the git repository, particularly merges and conflict resolution. Unfortunately there is no solution to this problem: from now on we will have to consider in each sprint a task (unrelated to any user story) for maintaining the repository.

In this sprint we started immediately with the aim of completing 4 US. Therefore, we decided to work in parallel on all 4 at the same time. This was a mistake because when the team works on 4 different stories, synchronization between members becomes extremely difficult. in the end we still managed to reach our goal but from next time we will have to try to work on a maximum of 2 US at a time: as soon as we finish one we start another. We cannot disperse our energies on too many US at the same time

Finally, what we believe to be our biggest mistake: we did not include a task for the design of the system in our boards. Immediately after identifying the requirements (i.e. the user stories), we moved on to setting up the back end and front end. If before doing this we had spent at least an hour thinking about how to implement the solutions, we would not have had the problem of rewriting the database multiple times. Until the very last day we had problems understanding what each table did resulting in slowdowns on our roadmap and the production of numerous unstable intermediate versions.

Even though we had all these problems, we still managed to deliver everything we set out to deliver. Not only that: excluding the tasks related to the organization of the sprint, all the others were finished earlier than expected. We also got to learn new programming techniques and new frameworks. Despite everything, we can consider this sprint a great success!


