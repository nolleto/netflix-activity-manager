# Netflix Activity Manager

The purpose of this script it is create the easiest way to remove a lot of series or shows from your Netflix Activity page (https://www.netflix.com/viewingactivity) without needing to click one by one.

![](using-the-script-example.gif)

### What does this script?

This script gets all activities from the Netflix Activity page through the HTML and generates a modal with a table listing all series, shows, and movies grouped by the session with a remove button.
Clicking on this remove button all the activities from the serie/show/movie selected will be hidden through clicking on all 'Hide from viewing History' button on Netflix Activity page that corresponding the serie/show/movie selected.

### How does this works?

On executing this on your browser's console a button named 'Manage activities' will appears beside the title (My Activity).
Clicking on this button a dialog will open asking how many times would you like the "Show More" button.
> **Why?** as mentioned above, the script gets only what the page shows so if you wanna see and erase more activities you need to load more activities. How will be too boring clicking a lot of times in this button, there is a script that does that for you.

So, if you cancel or leave the input blank, the modal will open with our current activities, otherwise, the script will start to clicking the "Show More" button the number of times you filled in the input. A modal with progress will open so you can follow the progress.

> One important thing to mention is that if you don't have more activities to load, the process of hit the "Show More" button will stop before executing the number of times you wished.

When this process finished, a modal with a table will open so you can remove your activities.

### But why did I create this script?
Well, I had a shared Netlfix's account and sometimes when I open my profile I see a lot of series and show in my activities that I didn't watch. This happens because another user just had to use my profile (why?!??!) and watched a lot of things (that I don't like) and then I start to see recommendations that I don't care and it's hard to find out what's series and shows I was watching the last time (*cry in Spanish*).
So, I've created this script to help with my little _problem_

Netflix, please make possible add a password on profiles.
