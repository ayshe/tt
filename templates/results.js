import styles from "./styles";
import {season, title} from "../src/constants.js"
export default `
<html>
    <head>
        <title>TT Season ${season}: ${title}</title>
        ${styles}
    </head
    <body>
    <div>
    <h1>TT Season ${season}: ${title}</h1>
        <svg width="1280" height="700"></svg>
        <div class="ipaddress"></div>

        <script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/js/materialize.js"></script>
        
        <script src="/results.js"></script>
    </div>
    </body>
</html>
`;