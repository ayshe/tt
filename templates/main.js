import styles from "./styles";
export default `
<html>
    <head>
        <title>TT</title>
        ${styles}
    </head>
    <body>
    <div class="container">
        <div class="players"></div>
        <div class="versus"></div>
        <div class="matchlog"></div>
        <div class="ipaddress"></div>

        <script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/js/materialize.js"></script>
        
        <script src="/main.js"></script>
    </div>
    </body>
</html>
`;