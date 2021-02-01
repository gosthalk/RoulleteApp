<?php


namespace App\Controller;


use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;

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
                $winNumber = $request->request->get('winNum');
                $bets = $request->request->get('bts');
                $balance = $request->request->get('balance');
                for($i=0;$i<36;$i++){
                    if($winNumber == $i+1){
                        if($bets[$i] != 0){
                            $balance += $bets[$i] * 35;
                        }
                    }
                }

                if($winNumber == 0){
                    if($bets[36] != 0){
                        $balance += $bets[36] * 38;
                    }
                }

                if($bets[37] != 0){
                    if($winNumber == 3 or $winNumber == 6 or $winNumber == 9 or
                        $winNumber == 12 or $winNumber == 15 or $winNumber == 18 or
                        $winNumber == 21 or $winNumber == 24 or $winNumber == 27 or
                        $winNumber == 30 or $winNumber == 33 or $winNumber == 36){
                            $balance += $bets[37] * 3;
                    }
                }

                if($bets[38] != 0){
                    if($winNumber == 2 or $winNumber == 5 or $winNumber == 8 or
                        $winNumber == 11 or $winNumber == 14 or $winNumber == 17 or
                        $winNumber == 20 or $winNumber == 23 or $winNumber == 26 or
                        $winNumber == 29 or $winNumber == 32 or $winNumber == 35){
                            $balance += $bets[38] * 3;
                    }
                }

                if($bets[39] != 0){
                    if($winNumber == 1 or $winNumber == 4 or $winNumber == 7 or
                        $winNumber == 10 or $winNumber == 13 or $winNumber == 16 or
                        $winNumber == 19 or $winNumber == 22 or $winNumber == 25 or
                        $winNumber == 28 or $winNumber == 31 or $winNumber == 34){
                            $balance += $bets[39] * 3;
                    }
                }

                if($bets[40] != 0){
                    if($winNumber >=1 and $winNumber <= 12){
                        $balance += $bets[40] * 3;
                    }
                }

                if($bets[41] != 0){
                    if($winNumber >=13 and $winNumber <= 24) {
                        $balance += $bets[41] * 3;
                    }
                }

                if($bets[42] != 0){
                    if($winNumber >=25 and $winNumber <= 36) {
                        $balance += $bets[42] * 3;
                    }
                }

                if($bets[43] != 0){
                    if($winNumber >= 1 and $winNumber <= 18) {
                        $balance += $bets[43] * 2;
                    }
                }

                if($bets[44] != 0){
                    if($winNumber >= 19 and $winNumber <= 36){
                        $balance += $bets[44] * 2;
                    }
                }

                if($bets[45] != 0){
                    if($winNumber % 2 == 0){
                        $balance += $bets[45] * 2;
                    }
                }

                if($bets[46] != 0){
                    if($winNumber % 2 != 0){
                        $balance += $bets[46] * 2;
                    }
                }

                if($bets[47] != 0){
                    if($winNumber == 1 or $winNumber == 3 or $winNumber == 5 or $winNumber == 7 or
                        $winNumber == 9 or $winNumber == 11 or $winNumber == 13 or $winNumber == 15 or
                        $winNumber == 17 or $winNumber == 19 or $winNumber == 21 or $winNumber == 23 or
                        $winNumber == 25 or $winNumber == 27 or $winNumber == 29 or $winNumber == 31 or
                        $winNumber == 33 or $winNumber == 35){
                            $balance += $bets[47] * 2;
                    }
                }

                if($bets[48] != 0){
                    if($winNumber == 2 or $winNumber == 4 or $winNumber == 6 or $winNumber == 8 or
                        $winNumber == 10 or $winNumber == 12 or $winNumber == 14 or $winNumber == 16 or
                        $winNumber == 18 or $winNumber == 20 or $winNumber == 22 or $winNumber == 24 or
                        $winNumber == 26 or $winNumber == 28 or $winNumber == 30 or $winNumber == 32 or
                        $winNumber == 34 or $winNumber == 36){
                            $balance += $bets[48] * 2;
                    }
                }

                $id = $this->getUser()->getId();
                $entityManager = $this->getDoctrine()->getManager();
                $user = $entityManager->getRepository(User::class)->find($id);
                $user->setBalance($balance);
                $entityManager->flush();

                return new JsonResponse(array(
                    'balance' => $balance
                ),200);


            }else{
                $this->redirect('/login');
            }
        }
        return new JsonResponse(array(
            'status' => 'Error',
            'message' => 'ErrorGlobal'
        ),400);
    }
}