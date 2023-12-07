<!DOCTYPE html>
<html lang='pt-br'>
<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?= $title ?>
    </title>
    <?= $this->Html->meta('icon') ?>

    <?= $this->Html->script('jquery-1.10.2.min.js') ?>
    <?= $this->Html->script('bootstrap.min.js') ?>
    <?= $this->Html->script('modernizr.min.js') ?>

    <?= $this->Html->css('style.css') ?>
    <?= $this->Html->css('style-responsive.css') ?>
    <?= $this->Html->css('global.css') ?>

    <?= $this->Html->script('html5shiv.js') ?>
    <?= $this->Html->script('respond.min.js') ?>

    <?= $this->fetch('meta') ?>
    <?= $this->fetch('css') ?>
    <?= $this->fetch('script') ?>
<style>
input[type="password"] {
    margin-bottom: 10px;
}

h4{
    text-align:center;
}

html{
    height: 100%;
}
body{
  background: #65cea7 url("../images/login-bg.jpg")  center/cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
table{
    background: #ffffff;
    margin-left: 15%;
}table tfoot{background: #ffffff;}
main{
  background: #fff;
  max-width: 340px;
  align-self: center;
  padding: 2.5em;
  border-radius: 1.2em;
}
img{
	max-width: 220px;
	display:block;
	margin: 0 auto;
}
h1{
	font-size: 22px;
  	text-align: center;
  	font-weight: 600;
}
a{
	display:block;
	text-align:center;
}
.btn {
  display: block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  border-radius: 0;
  background-color: #00b2cd;
  color: #fff;
  border-color: #00b2cd;
  -webkit-transition: opacity 0.3s ease;
  transition: opacity 0.3s ease;
  margin: 0 auto;
}.btn:hover {
  opacity: .7;
}
</style>
<script>
$(document).ready(function(){

$('#btnEnvia').click(function(e) {
    var ok = validaSenhas();
    if (!ok) {
        e.preventDefault();
    }
});
    function validaSenhas(){
        if($('#novaSenha').val().length > 5){
            if($('#novaSenha').val() == $('#confirmaSenha').val()){
                return true;
            }else{
                alert('As duas senhas precisam ser iguais!');
                return false;
            }
        }else{
            alert('Digite uma senha com mais de 5 caracteres');
            return false;
        }
    };
});

</script>

</head>
<body>
<main>
    <form method='post' action='?id=<?= $id ?>&username=<?= $username ?>&n=<?= $acesso ?>'>
        <table>
            <caption></caption>
            <thead>
                <tr>
                <img src="/images/logo2.png" alt="Tecnoportas"/>                    
                </tr>                
                <tr>
                    <td><h4>Olá <?= $username ?>!</h4><br/>Crie sua nova senha...</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type='password' id="novaSenha" name='novasenha' placeholder='Nova Senha' /></td>
                </tr>
                <tr>
                    <td><input type='password' id="confirmaSenha" name='confirmasenha' placeholder='Confirmar Senha' /></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td><input id="btnEnvia" class="btn" type='submit' value='Alterar'/></td>
                </tr>
                <?php if (!empty($erro)) : ?>
                <tr>
                    <td class='msg-erro'><?= $erro ?></td>
                </tr>
                <?php endif; ?>
                <?php if (!empty($mensagem)) : ?>
                <tr>
                    <td class='msg-info'><?= $mensagem ?></td>
                </tr>
                <?php endif; ?>
            </tfoot>
        </table>
    </form>
</main>
</body>
</html>