class myStories {

    getStory = (storyName) => {
        try {
            let storyToUse = -1;
            console.log("mystories");

            if (storyName < 'c')
                storyToUse = this.getStory_a_to_b(storyName);
            else if (storyName < 'k')
                storyToUse = this.getStory_c_to_j(storyName);
            else if (storyName < 'p')
                storyToUse = this.getStory_k_to_o(storyName);
            else if (storyName < 't')
                storyToUse = this.getStory_p_to_s(storyName);
            else
                storyToUse = this.getStory_t_to_z(storyName);

            if (storyToUse !== -1) {
                // console.log("StoryFound: ", storyToUse);
                return storyToUse;
            } else {
                return null;
            }
        } catch (error) {
            console.log("exception for getStory:", storyName);
            console.log(error);
            // myfuncs.mySentry(error);
        }
    };

    getStory_a_to_b = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

    getStory_c_to_j = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };
    getStory_k_to_o = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

    getStory_p_to_s = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {
                case 'summerVacationAtGrandmas.json':
                    storyToUse = require('../assets/stories/summerVacationAtGrandmas.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

    getStory_t_to_z = (storyName) => {
        let storyToUse = -1;    // This commented out code works. Use it if we want to package the
        try {
            switch (storyName) {    // images in assets/images
                case 'testTwoStory.json':
                    storyToUse = require('../assets/stories/testTwoStory.json');
                    break;
                case 'testTwoStory2.json':
                    storyToUse = require('../assets/stories/testTwoStory2.json');
                    break;
                case 'uncleNedsFireworks.json':
                    storyToUse = require('../assets/stories/uncleNedsFireworks.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

}

const mystories = new myStories();
export default mystories;