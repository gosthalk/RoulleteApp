<?php


namespace App\Controller;


use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CalculateController extends AbstractController
{
    public function calculate(Request $request){
        if(!$request->isXmlHttpRequest()){
            return new JsonResponse(array(
                'status' => 'Error',
                'message' => 'ErrorNoAjax'),
                400);
        }
        if(isset($request->request)){
            if($this->isGranted('IS_AUTHENTICATED_FULLY')){
                // todo: 1. parsing bets and winNumber and calculate balance and responce it and update on site
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