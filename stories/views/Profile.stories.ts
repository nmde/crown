import Vue from 'vue';
import ProfileTSX from '../../src/frontend/views/Profile';

// Convert TSX to actual Vue component
const Profile = Vue.component('Profile', ProfileTSX);

export default {
  title: 'Views/Profile',
  component: Profile,
};

const Template = () => ({
  components: { Profile },
  template: '<Profile />',
});

// Primary story - No data is loaded
export const Primary = Template.bind({});
Primary.args = {};

// Loading
export const Loading = Template.bind({});
Loading.args = {};

// Displaying a fake user
export const WithUser = Template.bind({});
WithUser.args = {};

// Trying to get a user that doesn't exist
export const MissingUser = Template.bind({});
MissingUser.args = {};
