<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\DemoFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

use const JSON_THROW_ON_ERROR;

class DemoController extends AbstractController
{
    #[Route('/', name: 'demo_index_default', methods: ['GET'])]
    public function indexDefault(): Response
    {
        return $this->redirectToRoute('demo_index', ['_locale' => 'en'], Response::HTTP_FOUND);
    }

    #[Route('/{_locale}', name: 'demo_index', requirements: ['_locale' => 'en|es'], methods: ['GET', 'POST'])]
    public function index(Request $request, TranslatorInterface $translator): Response
    {
        $form = $this->createForm(DemoFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = json_encode($form->getData(), JSON_THROW_ON_ERROR);
            $this->addFlash('success', $translator->trans('demo.form_submitted', ['%data%' => $data]));

            return $this->redirectToRoute('demo_index', ['_locale' => $request->getLocale()]);
        }

        return $this->render('demo/index.html.twig', [
            'form' => $form,
        ]);
    }
}
