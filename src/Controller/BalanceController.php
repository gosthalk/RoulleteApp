<?php


namespace App\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;

class BalanceController extends AbstractController
{
    public function getBalance(Request $request){
        if(!$request->isXmlHttpRequest()){
            return new JsonResponse(array(
                'status' => 'Error',
                'message' => 'ErrorNoAjax'),
            400);
        }
        if(isset($request->request)){
            if($this->isGranted('IS_AUTHENTICATED_FULLY')){
                $balance = $this->getUser()->getBalance();
                return new JsonResponse(array(
                    'balance' => $balance
                ));
            }else{
                $this->redirect('/');
            }
        }
        return new JsonResponse(array(
            'status' => 'Error',
            'message' => 'ErrorGlobal'
        ),400);
    }
}