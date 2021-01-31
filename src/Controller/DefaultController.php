<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/default", name="default")
     */
    public function index(): Response
    {
        if($this->isGranted('IS_AUTHENTICATED_FULLY')){
            $balance = $this->getUser()->getBalance();
        }else{
            $balance = 0;
        }
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
            'balance' => $balance,
        ]);
    }
}
