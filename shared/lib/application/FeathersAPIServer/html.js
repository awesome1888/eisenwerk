import LordVader from '../../ascii/vader';
import Yoda from '../../ascii/yoda';

const template = `
    <style>body{font-family: sans-serif}</style>
    <% if(!production) { %>
        <pre>${Yoda}</pre>
        <% if (services.length) { %>
            <h3>The entities following use you may, young Padawan:</h3>
            <ul>
                <% for (let k = 0; k < services.length; k++) { %>
                    <li><a href="<%= services[k].getPath() %>"><%= services[k].getPath() %></a> &mdash; <%= services[k].getDescription() %></li>
                <% } %>
            </ul>
        <% } %>
        <% if (methods.length) { %>
            <h3>Methods, young apprentice:</h3>
            <ul>
                <% for (let k = 0; k < methods.length; k++) { %>
                    <li><%= methods[k] %></li>
                <% } %>
            </ul>
        <% } %>
        
        <% if (settings.useAuth()) { %>
            <h3>Authentication enabled:</h3>
            <ul>
                <% if (settings.useAuthLocal()) { %>
                    <li><a href="/authentication">local<a/></li>
                <% } %>
                 <% if (settings.useOAuthGoogle()) { %>
                    OAuth2 Google
                <% } %>
            </ul>
        <% } %>
    <% } else { %>
        <pre>${LordVader}</pre>
        <h3>You may dispense with the pleasantries</h3>
    <% } %>
`;

export default template;
